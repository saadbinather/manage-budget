# Personal Finance Tracker

A modern, user-friendly web application to help you track your income, expenses, and budgets. Analyze your financial habits, visualize trends, and manage your money smarter.

## Features

- **Dashboard**: Overview of your financial status, recent transactions, and budget alerts.
- **Profile**: Manage your personal information and see a summary of your financial activities.
- **Statistics**: Advanced filters and charts to analyze your spending patterns and trends.
- **Transaction History**: View, edit, and delete all your past transactions.
- **Multi-language Support**: Easily switch between English and Spanish.
- **Categories**: Organize your expenses and income by customizable categories.
- **Budget Management**: Set monthly budgets and receive warnings when you approach or exceed your limits.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/personal-finance-tracker.git
   cd personal-finance-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/contexts/LanguageContext.tsx` — Handles multi-language support.
- `src/components/` — Reusable UI components.
- `src/pages/` — Main application pages (Dashboard, Profile, Stats, History).
- `src/utils/` — Utility functions and helpers.

## Customization

- **Add/Edit Categories**: Update the categories in the LanguageContext or relevant configuration files.
- **Add More Languages**: Extend the `LanguageContext.tsx` with new language objects.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Inspired by modern finance management tools.
- Built with React, TypeScript, and love.

---
