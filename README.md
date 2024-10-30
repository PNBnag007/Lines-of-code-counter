# Lines of Code Counter

This tool analyzes lines of code across specified file types, meeting both basic and bonus requirements.

## Key Features

- **Recursive Directory Scan**: Scans all files in specified directories.
- **Line Type Detection**:
  - **Code Lines**: Counts lines with executable code.
  - **Comment Lines**: Separates single-line and block comments.
  - **Empty Lines**: Tracks blank lines.
- **Granular Component Detection**:
  - **Import Statements**: Counts import dependencies.
  - **Function Definitions**: Detects functions.
  - **Variable Declarations**: Identifies variables.

## Bonus Features

- **Configurable Detection**: Add new categories (e.g., classes, specific keywords) through a configuration file without changing core code.
- **Language-Specific Rules**: Uses syntax rules for accurate classification by language.
- **Detailed Reporting**: Outputs counts for code, comments, empty lines, imports, functions, variables, and custom categories.

## Architecture

1. **File Scanner**: Identifies files by extension within directories.
2. **Parser**: Classifies lines as code, comments, empty, import, function, or variable based on **configurable syntax rules**.
3. **Configuration File**: Defines syntax patterns and additional categories, enabling flexible detection without code changes.
4. **Aggregator**: Summarizes results with counts per file and an overall total.

## Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/PNBnag007/Lines-of-code-counter.git
