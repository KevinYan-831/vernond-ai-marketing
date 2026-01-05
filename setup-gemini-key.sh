#!/bin/bash

# Helper script to set up Gemini API key in Supabase
# Run this after you get your Gemini API key from https://aistudio.google.com/app/apikey

echo "==================================================="
echo "Gemini API Key Setup for Supabase Edge Functions"
echo "==================================================="
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found."
    echo ""
    echo "Please install it first:"
    echo "  npm install -g supabase"
    echo ""
    echo "Or set the key manually via Supabase Dashboard:"
    echo "  1. Go to: https://supabase.com/dashboard/project/gpjmttgqolnblfiiikra/settings/functions"
    echo "  2. Add secret: GEMINI_API_KEY = your-key-here"
    echo ""
    exit 1
fi

echo "Enter your Gemini API key (starts with AIza...):"
read -r GEMINI_KEY

if [ -z "$GEMINI_KEY" ]; then
    echo "❌ No key provided. Exiting."
    exit 1
fi

# Validate key format
if [[ ! $GEMINI_KEY == AIza* ]]; then
    echo "⚠️  Warning: Key doesn't start with 'AIza'. Are you sure this is correct?"
    echo "Continue anyway? (y/n)"
    read -r confirm
    if [ "$confirm" != "y" ]; then
        echo "Cancelled."
        exit 1
    fi
fi

echo ""
echo "Setting GEMINI_API_KEY in Supabase..."

# Set the secret
supabase secrets set GEMINI_API_KEY="$GEMINI_KEY"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! GEMINI_API_KEY has been set."
    echo ""
    echo "Next steps:"
    echo "  1. Deploy the edge function:"
    echo "     supabase functions deploy analyze-magic-trick"
    echo ""
    echo "  2. Test your app at http://localhost:5173"
    echo ""
else
    echo ""
    echo "❌ Failed to set secret."
    echo ""
    echo "Try setting it manually via dashboard:"
    echo "  https://supabase.com/dashboard/project/gpjmttgqolnblfiiikra/settings/functions"
    echo ""
fi
