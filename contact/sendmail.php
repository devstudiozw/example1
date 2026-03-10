<?php
/**
 * ALPHA JUNIOR SCHOOL - CONTACT FORM BACKEND
 * Project: Alpha Junior School Website
 * Developer: devstudio.co.zw
 * Logic: Process POST data, sanitize fields, and dispatch email via PHP mail().
 */

header('Content-Type: application/json');

// --- 1. REQUEST VALIDATION ---
// Only allow POST requests for improved security
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- 2. INPUT SANITIZATION ---
    // Strip potential malicious tags and normalize data
    $name = filter_var(trim($_POST["parent_name"]), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = filter_var(trim($_POST["phone"]), FILTER_SANITIZE_STRING);
    $age = filter_var(trim($_POST["child_age"]), FILTER_SANITIZE_NUMBER_INT);
    $message = filter_var(trim($_POST["message"]), FILTER_SANITIZE_STRING);

    // --- 3. BACKEND VALIDATION ---
    // Ensure critical fields aren't empty after sanitization
    if (empty($name) || empty($email) || empty($phone) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
        exit;
    }

    // Validate proper email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Please provide a valid email address.']);
        exit;
    }

    // --- 4. EMAIL DISPATCH ---
    // Configuration
    $recipient = "merggielonely@gmail.com";
    $subject = "New Enrollment Inquiry from AJS Website - $name";

    // Body construction
    $email_content = "New website inquiry received:\n\n";
    $email_content .= "Parent/Guardian Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n";
    $email_content .= "Child's Age: " . ($age ? $age : 'Not specified') . "\n\n";
    $email_content .= "Message/Inquiry:\n$message\n";

    // Headers
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Execution
    if (mail($recipient, $subject, $email_content, $headers)) {
        echo json_encode(['status' => 'success', 'message' => 'Thank you! Your message has been sent successfully. We will get back to you shortly.']);
    }
    else {
        echo json_encode(['status' => 'error', 'message' => 'Sorry, there was an issue sending your message. Please try calling us directly.']);
    }

}
else {
    // Handling direct access or other methods
    echo json_encode(['status' => 'error', 'message' => 'There was a problem with your submission, please try again.']);
}
?>
