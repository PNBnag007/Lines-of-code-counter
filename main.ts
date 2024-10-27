import * as fs from "fs";
import * as path from "path";

// Load configuration from JSON file
const configPath: string = "Lines-of-code-counter\\config.json";
const inputPath: string = "Lines-of-code-counter\\test_cases\\test.java"; // Replace with your file path
// const inputPath: string = "Lines-of-code-counter\\test_cases\\test_dir"; // Replace with your file path
const config: { categories: Array<{ name: string; pattern?: string; startPattern?: string; endPattern?: string, type: string; }> } = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// Define the structure for category patterns
interface CategoryPattern {
    name: string;
    regex: RegExp | null;
    startRegex: RegExp | null;
    endRegex: RegExp | null;
    type: string;
    isMultiLine: boolean;
}

// Compile patterns and initialize counters
const categoryPatterns: CategoryPattern[] = config.categories.map(category => ({
    name: category.name,
    regex: category.pattern ? new RegExp(category.pattern) : null,
    startRegex: category.startPattern ? new RegExp(category.startPattern) : null,
    endRegex: category.endPattern ? new RegExp(category.endPattern) : null,
    type: category.type,
    isMultiLine: !!category.startPattern
}));

// Define the structure for counters
interface Counters {
    codeLines: number;
    totalLines: number;
    [key: string]: number; // Allow for dynamic keys based on category names
}

const counters: Counters = { codeLines: 0, totalLines: 0 };

// Initialize category counters based on config names
config.categories.forEach(category => {
    counters[category.name] = 0;
});

// Function to check and update counters based on patterns
function updateCounters(line: string, inMultiLineComment: boolean): boolean {
    let matchedCategory = false;

    for (const { name, regex, startRegex, endRegex, type, isMultiLine } of categoryPatterns) {
        if (inMultiLineComment && name === "multiLineComment") {
            // Count line as part of a multi-line comment
            counters[name]++;
            matchedCategory = true;
            // Check if multi-line comment ends
            if (endRegex && endRegex.test(line)) {
                inMultiLineComment = false;
            }
            break;
        } else if (regex && regex.test(line)) {
            // Single-line category match
            counters[name]++;
            if (type == 'code') counters.codeLines++;
            matchedCategory = true;
            break;
        } else if (isMultiLine && startRegex && startRegex.test(line)) {
            // Multi-line comment start detected
            counters[name]++;
            matchedCategory = true;
            inMultiLineComment = true;
            // If line also ends multi-line comment, reset state
            if (endRegex && endRegex.test(line)) {
                inMultiLineComment = false;
            }
            break;
        }
    }

    if (!matchedCategory) {
        counters.codeLines++; // If no category matched, count as code
    }

    return inMultiLineComment; // Return multi-line comment state
}

// Function to analyze lines in a single file
function analyzeFile(filePath: string): void {
    const fileContent: string = fs.readFileSync(filePath, "utf-8");
    const lines: string[] = fileContent.split("\n");

    let inMultiLineComment: boolean = false;

    lines.forEach(line => {
        counters.totalLines++; // Increment total line count
        inMultiLineComment = updateCounters(line.trim(), inMultiLineComment);
    });
}

// Function to analyze all files in a directory
function analyzeDirectory(directoryPath: string): void {
    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) { // Check for specific file types
            console.log(`Analyzing file: ${filePath}`);
            analyzeFile(filePath);
        } else if (stat.isDirectory()) {
            console.log(`Entering directory: ${filePath}`);
            analyzeDirectory(filePath); // Recursively analyze subdirectories
        }
    });
}

// Main function to handle either single file or directory input
function analyzePath(inputPath: string): void {
    // Reset core counters for overall results
    counters.codeLines = 0;
    counters.totalLines = 0;
    for (const key of Object.keys(counters)) {
        if (key !== "codeLines" && key !== "totalLines") counters[key] = 0;
    }

    if (fs.statSync(inputPath).isFile()) {
        // Single file analysis
        console.log(`Analyzing file: ${inputPath}`);
        analyzeFile(inputPath);
    } else if (fs.statSync(inputPath).isDirectory()) {
        // Directory analysis
        console.log(`Analyzing directory: ${inputPath}`);
        analyzeDirectory(inputPath);
    } else {
        console.log("Invalid path: Please provide a valid file or directory.");
    }

    // Output results after analysis
    console.log("\nOverall Analysis Results:");
    for (const [name, count] of Object.entries(counters)) {
        console.log(`${name.charAt(0).toUpperCase() + name.slice(1)}: ${count}`);
    }
}

// Run the analysis on a given path (file or directory)
analyzePath(inputPath);
