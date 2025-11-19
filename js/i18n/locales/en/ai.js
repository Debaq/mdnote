// AI Assistant translations - English
export default {
    title: 'AI Assistant',
    subtitle: 'Work with artificial intelligence',
    status: {
        active: 'AI Active',
        inactive: 'AI Inactive',
        processing: 'Processing...'
    },
    modes: {
        write: 'AI Writes',
        assist: 'AI Assists'
    },
    assistantModes: {
        continue: 'Continue writing',
        suggest: 'Suggest ideas',
        analyze: 'Analyze text',
        improve: 'Improve passage',
        dialogue: 'Generate dialogue',
        worldbuild: 'Expand worldbuilding',
        characterize: 'Develop character'
    },
    prompt: {
        label: 'Instruction for AI',
        placeholder: 'Tell the AI what you want it to do...',
        examples: {
            write: 'Example: Write a chapter where {character} discovers a secret',
            assist: 'Example: Suggest improvements for this paragraph'
        }
    },
    actions: {
        generate: 'Generate',
        apply: 'Apply Changes',
        reject: 'Reject',
        retry: 'Retry'
    },
    history: {
        title: 'History',
        empty: 'No interactions yet',
        user: 'You',
        assistant: 'AI'
    },
    settings: {
        title: 'AI Configuration',
        apiKeys: 'API Keys',
        model: 'Model',
        temperature: 'Temperature',
        maxTokens: 'Max Tokens',
        noApiKey: 'No API key configured',
        configure: 'Configure'
    },
    noProvidersConfigured: 'No providers with API key configured. Go to AI Settings to add one.',
    projectContext: 'Project Context',
    project: 'Project:',
    characters: 'Characters:',
    chapters: 'Chapters:',
    inputPlaceholder: 'Type your query here... (e.g., \'Continue the current chapter\', \'Give me ideas for the next scene\', \'Analyze this dialogue\')',
    configRequired: 'Configuration required: Please configure an API key in Settings → AI Configuration to use the assistant.',
    confirmClearChat: 'Are you sure you want to clear the chat? This action cannot be undone.',
    openChapterFirst: '⚠️ Please open a chapter first',
    textInserted: '✅ Text inserted into current chapter',
    serviceUnavailable: '❌ The AI service is unavailable'
};
