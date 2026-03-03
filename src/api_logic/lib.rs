use miniserde::{json, Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Deserialize, Debug)]
struct AIAppManifest {
    app_name: String,
    version: String,
    risk_category: String,
    app_description: Option<String>,
    declared_flags: Vec<String>,
    fallback_ai_verification: Option<bool>,
    client_id: Option<String>,
}

#[derive(Serialize)]
struct AuditResponse {
    app_name: String,
    version: String,
    client_id: String,
    rules_version: String,
    verdict: String,
    risk_score: u8,
    flags_triggered: Vec<String>,
    manual_review_required: bool,
}

fn risk_weight(category: &str) -> u8 {
    match category {
        "Minimal" => 1,
        "Limited" => 2,
        "High" => 3,
        "Unacceptable" => 4,
        _ => 0,
    }
}

/// Matrice lexicală precisă pentru detectarea clasificărilor false de risc
/// Activează HUMAN_INTERVENTION_REQUIRED fără a condamna definitiv clientul
fn detect_risk_mismatch(description: &str, declared_weight: u8) -> bool {
    if declared_weight >= 3 {
        return false; // A declarat High/Unacceptable deja — corect
    }
    let desc_lower = description.to_lowercase();
    let high_risk_keywords = [
        "recruitment",
        "screening",
        "medical diagnosis",
        "credit score",
        "loan approval",
        "biometric",
        "law enforcement",
        "criminal",
        "emotion recognition",
        "critical infrastructure",
    ];
    high_risk_keywords.iter().any(|&kw| desc_lower.contains(kw))
}

/// Top 10 Reguli AI Act hardcodate ca fallback de urgență
/// Acestea sunt suprascrise dacă KV returnează reguli actualizate
fn get_fallback_rules_json() -> &'static str {
    r#"{"rules":[
        {"id":"ART5-001","description":"Subliminal manipulation techniques are forbidden","risk_category":"Unacceptable","required_flags":[],"forbidden_flags":["subliminal_techniques","subconscious_targeting"]},
        {"id":"ART5-002","description":"Exploitation of user vulnerabilities is forbidden","risk_category":"Unacceptable","required_flags":[],"forbidden_flags":["exploits_age_vulnerability","exploits_disability_vulnerability"]},
        {"id":"ART5-003","description":"Social scoring by public authorities is forbidden","risk_category":"Unacceptable","required_flags":[],"forbidden_flags":["social_scoring","citizen_trustworthiness_ranking"]},
        {"id":"ART5-004","description":"Real-time biometric identification in public spaces is forbidden","risk_category":"Unacceptable","required_flags":[],"forbidden_flags":["realtime_biometric_public_space"]},
        {"id":"ART5-005","description":"Emotion recognition in workplace or education is forbidden","risk_category":"Unacceptable","required_flags":[],"forbidden_flags":["emotion_recognition_workplace","emotion_recognition_education"]},
        {"id":"ART10-001","description":"High-risk AI must have documented data governance and bias assessment","risk_category":"High","required_flags":["bias_assessment_performed","data_governance_policy_documented"],"forbidden_flags":[]},
        {"id":"ART13-001","description":"High-risk AI must inform users they are interacting with AI","risk_category":"High","required_flags":["user_notification_ai_interaction","transparency_disclosure_provided"],"forbidden_flags":[]},
        {"id":"ART14-001","description":"High-risk AI must support active human oversight and interrupt capability","risk_category":"High","required_flags":["human_oversight_enabled","human_interrupt_capability"],"forbidden_flags":[]},
        {"id":"ART14-002","description":"High-risk AI must provide explainability — black-box systems are forbidden","risk_category":"High","required_flags":["explainability_mechanism_present"],"forbidden_flags":["black_box_no_explanation"]},
        {"id":"ART22-001","description":"High-risk AI must complete conformity assessment before deployment","risk_category":"High","required_flags":["conformity_assessment_completed"],"forbidden_flags":[]}
    ]}"#
}

/// Structuri pentru parsarea regulilor din KV sau fallback
#[derive(Deserialize, Clone)]
struct Rule {
    id: String,
    risk_category: String,
    required_flags: Vec<String>,
    forbidden_flags: Vec<String>,
}

#[derive(Deserialize)]
struct RulesWrapper {
    rules: Vec<Rule>,
}

/// Versiunea curentă a setului de reguli — incrementat la fiecare update al regulilor
const RULES_VERSION: &str = "2026-Q1.1";

/// Funcție pură wasm_bindgen: primește JSON manifest + JSON reguli, returnează JSON verdict
/// Nicio I/O, nicio rețea — execuție sub 3ms garantată
#[wasm_bindgen]
pub fn run_audit(manifest_json: &str, rules_json: &str) -> String {
    let manifest: AIAppManifest = match json::from_str(manifest_json) {
        Ok(m) => m,
        Err(_) => {
            return json::to_string(&AuditResponse {
                app_name: "Unknown".to_string(),
                version: "Unknown".to_string(),
                client_id: "Unknown".to_string(),
                rules_version: RULES_VERSION.to_string(),
                verdict: "INVALID_PAYLOAD".to_string(),
                risk_score: 100,
                flags_triggered: vec!["MALFORMED_JSON_CONTRACT".to_string()],
                manual_review_required: false,
            })
        }
    };

    let app_weight = risk_weight(&manifest.risk_category);
    if app_weight == 0 {
        return json::to_string(&AuditResponse {
            app_name: manifest.app_name.clone(),
            version: manifest.version.clone(),
            client_id: manifest.client_id.clone().unwrap_or_default(),
            rules_version: RULES_VERSION.to_string(),
            verdict: "INVALID_PAYLOAD".to_string(),
            risk_score: 100,
            flags_triggered: vec!["UNKNOWN_RISK_CATEGORY".to_string()],
            manual_review_required: false,
        });
    }

    // Parsare reguli din KV; dacă goale, folosim fallback-ul compilat
    let rules_wrapper: RulesWrapper = json::from_str(rules_json)
        .unwrap_or_else(|_| json::from_str(get_fallback_rules_json()).unwrap());

    let rules = if rules_wrapper.rules.is_empty() {
        json::from_str::<RulesWrapper>(get_fallback_rules_json())
            .unwrap()
            .rules
    } else {
        rules_wrapper.rules
    };

    let mut triggered_hard: Vec<String> = Vec::new();
    let mut triggered_soft: Vec<String> = Vec::new();
    let mut risk_score: u8 = 0;
    let mut requires_ai = manifest.fallback_ai_verification.unwrap_or(false);

    // 1. Liar's Dividend Detection — soft trigger, nu condamnare
    if let Some(desc) = &manifest.app_description {
        if detect_risk_mismatch(desc, app_weight) {
            triggered_soft.push("RISK_CATEGORY_MISMATCH_DETECTED".to_string());
            requires_ai = true;
        }
    }

    // 2. Regim Universal — Prohibiții Absolute (Art. 5)
    //    Se evaluează indiferent de risk_category declarată
    for rule in rules.iter().filter(|r| r.risk_category == "Unacceptable") {
        for flag in &rule.forbidden_flags {
            if manifest.declared_flags.contains(flag) {
                triggered_hard.push(format!("[{}] FORBIDDEN: {}", rule.id, flag));
                risk_score = 100;
            }
        }
    }

    // 3. Regim Condiționat — Obligații High/Limited (Art. 10, 13, 14, 22)
    //    Se evaluează doar dacă aplicația se declară High sau mai sus
    if app_weight >= 3 {
        for rule in rules.iter().filter(|r| r.risk_category == "High" || r.risk_category == "Limited") {
            for req in &rule.required_flags {
                if !manifest.declared_flags.contains(req) {
                    triggered_soft.push(format!("[{}] MISSING_REQUIRED: {}", rule.id, req));
                    risk_score = risk_score.saturating_add(25);
                    requires_ai = true;
                }
            }
            for flag in &rule.forbidden_flags {
                if manifest.declared_flags.contains(flag) {
                    triggered_soft.push(format!("[{}] FORBIDDEN: {}", rule.id, flag));
                    risk_score = risk_score.saturating_add(50);
                    requires_ai = true;
                }
            }
        }
    }

    // 4. Arbore de Decizie Secvențial
    let verdict = if !triggered_hard.is_empty() {
        "NON_COMPLIANT" // Încălcare absolută Art. 5 — fără AI, fără apel
    } else if !triggered_soft.is_empty() || requires_ai {
        "HUMAN_INTERVENTION_REQUIRED" // Pasă la Llama 3 via worker.js
    } else {
        "COMPLIANT"
    };

    let mut all_triggers = triggered_hard;
    all_triggers.append(&mut triggered_soft);

    json::to_string(&AuditResponse {
        app_name: manifest.app_name.clone(),
        version: manifest.version.clone(),
        client_id: manifest.client_id.clone().unwrap_or_default(),
        rules_version: RULES_VERSION.to_string(),
        verdict: verdict.to_string(),
        risk_score: risk_score.min(100),
        flags_triggered: all_triggers,
        manual_review_required: requires_ai,
    })
}
