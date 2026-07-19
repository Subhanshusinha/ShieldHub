// Script to seed quiz questions with difficulty levels
// Run with: node seed-quiz.js

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shieldhub')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Quiz Schema
const quizSchema = new mongoose.Schema({
    question: { type: String, required: true, trim: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true, min: 0, max: 3 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Quiz = mongoose.model('Quiz', quizSchema);

// 5 Easy Questions
const easyQuestions = [
    {
        question: "What does 'phishing' mean in cybersecurity?",
        options: ["A type of fishing sport", "Fraudulent attempts to steal sensitive information", "A computer virus that swims through networks", "A secure email protocol"],
        correctAnswer: 1,
        difficulty: "easy"
    },
    {
        question: "What is a strong password characteristic?",
        options: ["Using your birthday", "Using 'password123'", "Mix of uppercase, lowercase, numbers, and symbols", "Using your pet's name"],
        correctAnswer: 2,
        difficulty: "easy"
    },
    {
        question: "What does the 'S' in HTTPS stand for?",
        options: ["Speed", "Secure", "Server", "Simple"],
        correctAnswer: 1,
        difficulty: "easy"
    },
    {
        question: "What is malware?",
        options: ["A type of hardware", "Malicious software designed to harm computers", "A programming language", "A type of firewall"],
        correctAnswer: 1,
        difficulty: "easy"
    },
    {
        question: "What should you do if you receive a suspicious email?",
        options: ["Open all attachments immediately", "Click all links to verify", "Delete it or report it as spam", "Forward it to all your contacts"],
        correctAnswer: 2,
        difficulty: "easy"
    }
];

// 15 Medium Questions
const mediumQuestions = [
    {
        question: "What is two-factor authentication (2FA)?",
        options: ["Using two passwords", "A security method requiring two forms of verification", "Logging in twice", "Having two user accounts"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What is a VPN used for?",
        options: ["Increasing internet speed", "Creating encrypted connections and hiding IP address", "Downloading files faster", "Blocking all websites"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What is ransomware?",
        options: ["Software that speeds up your computer", "Malware that encrypts files and demands payment", "A type of antivirus", "A secure backup system"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What is social engineering in cybersecurity?",
        options: ["Building social media platforms", "Manipulating people to reveal confidential information", "Engineering social networks", "A type of firewall"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What is a firewall?",
        options: ["A wall that's on fire", "A security system that monitors and controls network traffic", "A type of virus", "A password manager"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What is a DDoS attack?",
        options: ["Direct Download of Software", "Distributed Denial of Service attack flooding servers", "Digital Defense of Systems", "Data Destruction of Servers"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What is encryption?",
        options: ["Deleting files permanently", "Converting data into a coded format for security", "Compressing files to save space", "Backing up data to cloud"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What is a Trojan horse in computing?",
        options: ["A wooden horse statue", "Malware disguised as legitimate software", "A type of processor", "A security certificate"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What is the purpose of antivirus software?",
        options: ["To create viruses", "To detect, prevent, and remove malware", "To slow down your computer", "To connect to the internet"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What is a keylogger?",
        options: ["A keyboard cleaning tool", "Software that records keystrokes to steal information", "A key copying machine", "A login manager"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What is spear phishing?",
        options: ["Fishing with a spear", "Targeted phishing attacks on specific individuals", "A type of spam filter", "A network security tool"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What does SSL/TLS protect?",
        options: ["Physical security", "Data transmitted between browser and server", "Computer hardware", "Computer memory"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What is a botnet?",
        options: ["A network of robots", "A network of compromised computers controlled by hackers", "A type of search engine", "A social media platform"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What is the dark web?",
        options: ["Websites with dark themes", "A hidden part of internet requiring special software to access", "Websites without images", "Slow loading websites"],
        correctAnswer: 1,
        difficulty: "medium"
    },
    {
        question: "What is a security patch?",
        options: ["A physical patch for computers", "A software update that fixes security vulnerabilities", "A type of antivirus", "A firewall configuration"],
        correctAnswer: 1,
        difficulty: "medium"
    }
];

// 25 Hard Questions
const hardQuestions = [
    {
        question: "What is a zero-day vulnerability?",
        options: ["A bug that was fixed on day zero", "A security flaw unknown to vendors with no patch available", "A virus that activates at midnight", "A firewall that needs daily updates"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is the purpose of a honeypot in cybersecurity?",
        options: ["To attract bees", "To lure attackers and study their methods", "To store encrypted passwords", "To speed up network traffic"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is SQL injection?",
        options: ["Injecting SQL databases into servers", "Inserting malicious SQL code to manipulate databases", "A database backup method", "A type of encryption"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is the principle of least privilege?",
        options: ["Giving everyone admin access", "Users should only have minimum access needed for their job", "Removing all user permissions", "Sharing passwords freely"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is cross-site scripting (XSS)?",
        options: ["Writing scripts that work across sites", "Injecting malicious scripts into trusted websites", "A programming language", "A network protocol"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is a man-in-the-middle (MITM) attack?",
        options: ["A physical attack", "Intercepting communication between two parties", "A type of virus", "A backup strategy"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is asymmetric encryption?",
        options: ["Using the same key for encryption and decryption", "Using different public and private keys", "Encrypting only half the data", "A broken encryption method"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is a buffer overflow attack?",
        options: ["Filling a buffer with water", "Exploiting memory allocation to execute malicious code", "A type of DDoS attack", "A network flooding technique"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is penetration testing?",
        options: ["Testing physical security", "Authorized simulated cyber attacks to find vulnerabilities", "Testing network speed", "Testing user passwords"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is the OWASP Top 10?",
        options: ["Top 10 programming languages", "List of most critical web application security risks", "10 best antivirus software", "10 fastest computers"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is a rainbow table attack?",
        options: ["An attack using colored tables", "Using precomputed hashes to crack passwords", "A DDoS attack variant", "A social engineering technique"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is APT (Advanced Persistent Threat)?",
        options: ["A programming technique", "Prolonged targeted cyber attack by skilled attackers", "An antivirus program", "A type of firewall"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is SIEM in cybersecurity?",
        options: ["Security Information and Event Management", "Simple Internet Email Manager", "Secure Internal Email Monitor", "System Integration Emergency Mode"],
        correctAnswer: 0,
        difficulty: "hard"
    },
    {
        question: "What is the purpose of salting passwords?",
        options: ["Making them taste better", "Adding random data before hashing to prevent rainbow attacks", "Encrypting them twice", "Storing them in plain text"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is a rootkit?",
        options: ["A gardening tool", "Malware that provides privileged access while hiding its presence", "A type of antivirus", "A network monitoring tool"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is the CIA triad in information security?",
        options: ["Central Intelligence Agency guidelines", "Confidentiality, Integrity, and Availability", "Computer Information Architecture", "Cyber Intelligence Analysis"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is a polymorphic virus?",
        options: ["A virus that only affects polymers", "Malware that changes its code to avoid detection", "A virus with multiple colors", "A beneficial program"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is DNS spoofing?",
        options: ["Creating fake DNS servers", "Corrupting DNS cache to redirect users to malicious sites", "A DNS backup method", "Speeding up DNS queries"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is session hijacking?",
        options: ["Stealing a car", "Taking over a valid user session to gain unauthorized access", "Creating new sessions", "Ending user sessions"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is a WAF (Web Application Firewall)?",
        options: ["A physical wall around servers", "Security that filters and monitors HTTP traffic to web apps", "A wireless access point", "A word processor"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is CSRF (Cross-Site Request Forgery)?",
        options: ["Creating fake websites", "Tricking users to perform actions they didn't intend", "A type of encryption", "A backup protocol"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is the purpose of a DMZ in network security?",
        options: ["A demilitarized zone for war", "A network segment that adds security layer between internal and external networks", "A type of firewall", "A virus scanning zone"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is fileless malware?",
        options: ["Malware without any code", "Malware that operates in memory without files on disk", "A harmless program", "A type of antivirus"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is privilege escalation?",
        options: ["Getting a promotion at work", "Exploiting vulnerabilities to gain higher access levels", "Installing new software", "Creating new user accounts"],
        correctAnswer: 1,
        difficulty: "hard"
    },
    {
        question: "What is the role of a SOC (Security Operations Center)?",
        options: ["Manufacturing socks", "Centralized team monitoring and responding to security incidents", "A type of firewall", "A programming language"],
        correctAnswer: 1,
        difficulty: "hard"
    }
];

async function seedQuestions() {
    try {
        // Delete all existing questions
        await Quiz.deleteMany({});
        console.log('✓ Deleted all existing quiz questions');

        // Combine all questions
        const allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];

        // Insert all questions
        await Quiz.insertMany(allQuestions);

        console.log('✓ Added 5 Easy questions');
        console.log('✓ Added 15 Medium questions');
        console.log('✓ Added 25 Hard questions');
        console.log('✓ Total: 45 unique cybersecurity questions added!');

        // Close connection
        await mongoose.connection.close();
        console.log('✓ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding questions:', error);
        process.exit(1);
    }
}

seedQuestions();
