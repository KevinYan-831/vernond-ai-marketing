#!/bin/bash

# Deployment script for Supabase Edge Function
# This script helps deploy the analyze-magic-trick function to Supabase

echo "=========================================="
echo "Supabase Edge Function Deployment Script"
echo "=========================================="
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found."
    echo ""
    echo "Install it with:"
    echo "  npm install -g supabase"
    echo ""
    echo "Or follow: https://supabase.com/docs/guides/cli"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if already logged in
if ! supabase projects list &> /dev/null; then
    echo "📝 Please login to Supabase..."
    supabase login

    if [ $? -ne 0 ]; then
        echo "❌ Login failed. Please try again."
        exit 1
    fi
fi

echo "✅ Logged in to Supabase"
echo ""

# Link to project
echo "🔗 Linking to your project (vnixswtxvuqtytnegqos)..."
supabase link --project-ref vnixswtxvuqtytnegqos

if [ $? -ne 0 ]; then
    echo "❌ Failed to link project."
    echo ""
    echo "Please check:"
    echo "  1. Project ref is correct (vnixswtxvuqtytnegqos)"
    echo "  2. You have access to this project"
    echo "  3. You're logged in with the correct account"
    echo ""
    exit 1
fi

echo "✅ Project linked"
echo ""

# Deploy the function
echo "🚀 Deploying edge function..."
echo ""
supabase functions deploy analyze-magic-trick

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed."
    echo ""
    echo "Check the error above and try again."
    exit 1
fi

echo ""
echo "✅ Function deployed successfully!"
echo ""

# Prompt for Gemini API key
echo "=========================================="
echo "Set Gemini API Key"
echo "=========================================="
echo ""
echo "Do you want to set the GEMINI_API_KEY now? (y/n)"
read -r set_key

if [ "$set_key" = "y" ] || [ "$set_key" = "Y" ]; then
    echo ""
    echo "Get your API key from: https://aistudio.google.com/app/apikey"
    echo ""
    echo "Enter your Gemini API key (starts with AIza...):"
    read -r GEMINI_KEY

    if [ -z "$GEMINI_KEY" ]; then
        echo "⚠️  No key provided. Skipping."
    else
        echo ""
        echo "Setting GEMINI_API_KEY..."
        supabase secrets set GEMINI_API_KEY="$GEMINI_KEY"

        if [ $? -eq 0 ]; then
            echo "✅ API key set successfully!"
        else
            echo "❌ Failed to set API key."
            echo ""
            echo "You can set it manually in Supabase Dashboard:"
            echo "  Settings → Edge Functions → Secrets"
        fi
    fi
else
    echo ""
    echo "⚠️  Skipping API key setup."
    echo ""
    echo "Remember to set it later in Supabase Dashboard:"
    echo "  Settings → Edge Functions → Secrets"
    echo "  Name: GEMINI_API_KEY"
    echo "  Value: Your Gemini API key"
fi

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Your function is now available at:"
echo "  https://vnixswtxvuqtytnegqos.supabase.co/functions/v1/analyze-magic-trick"
echo ""
echo "Next steps:"
echo "  1. Restart your dev server (if running)"
echo "  2. Test your app at http://localhost:5173"
echo "  3. Record a magic trick and see the AI analysis!"
echo ""
echo "To check logs:"
echo "  supabase functions logs analyze-magic-trick --tail 20"
echo ""
echo "Happy coding! 🎩✨"
echo ""
