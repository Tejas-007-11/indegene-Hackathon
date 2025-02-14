class DayAnalyzer {
    constructor() {
        this.apiKey = 'API_key_here'; 
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTextareaAutoResize();
    }

    setupEventListeners() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        const textarea = document.getElementById('dayDescription');

        analyzeBtn.addEventListener('click', () => this.analyzeDayDescription());
        
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.analyzeDayDescription();
            }
        });
    }

    setupTextareaAutoResize() {
        const textarea = document.getElementById('dayDescription');
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

    showLoading(show = true) {
        const loading = document.querySelector('.loading');
        loading.style.display = show ? 'flex' : 'none';
    }

    async analyzeDayDescription() {
        const description = document.getElementById('dayDescription').value.trim();
        
        if (!description) {
            this.showError('Please tell me about your day first!');
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Based on this daily reflection, provide:
1. A well-being and productivity score (0-100).
2. A thoughtful, empathetic analysis of the day.
3. Three specific, actionable suggestions personalized to the person's reflection.
   
Format the response like this:
**Day Score:** <score>/100  
**Analysis:** <analysis text>  
**Suggestions:**  
1. <Personalized Suggestion 1>  
2. <Personalized Suggestion 2>  
3. <Personalized Suggestion 3>  
   
Daily Reflection:  
${description}`

                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            if (!data.candidates || !data.candidates[0]) {
                throw new Error('Invalid response format');
            }

            this.updateResults(this.processResponse(data));
            this.animateResults();

        } catch (error) {
            console.error('Analysis error:', error);
            this.showError(`Unable to analyze: ${error.message}. Please check your API key and try again.`);
        } finally {
            this.showLoading(false);
        }
    }

    processResponse(data) {
        try {
            const responseText = data.candidates[0].content.parts[0].text;
            console.log('API Response:', responseText); // Debugging
    
            // Extract the score
            const scoreMatch = responseText.match(/\b\d{1,3}\b(?=\s*\/\s*100)/);
            const score = scoreMatch ? Math.min(100, parseInt(scoreMatch[0])) : 50; // Default to 50 if missing
    
            // Extract analysis
            const analysisMatch = responseText.match(/\*\*Analysis:\*\*(.*?)(?=\*\*Suggestions:|$)/s);
            const analysis = analysisMatch ? analysisMatch[1].trim() : 'Your day had its ups and downs, keep going!';
    
            // Extract suggestions
            const suggestionsMatch = responseText.match(/\*\*Suggestions:\*\*\s*(.*)/s);
            let suggestions = [];
    
            if (suggestionsMatch) {
                suggestions = suggestionsMatch[1]
                    .replace(/\*\*/g, '')
                    .split('\n')
                    .map(s => s.replace(/^\d+\.\s*/, '').trim()) // Remove numbering
                    .filter(s => s);
            }
    
            // If no suggestions are found, provide a meaningful fallback
            if (suggestions.length === 0) {
                suggestions = [
                    'Try something new tomorrow to break the routine.',
                    'Identify one challenge from today and plan how to overcome it.',
                    'Make time for a small moment of joy, like listening to your favorite song.'
                ];
            }
    
            return {
                score,
                analysis,
                suggestions
            };
        } catch (error) {
            console.error('Error processing response:', error);
            throw new Error('Error processing the analysis response');
        }
    }
    
    

    updateResults(results) {
        const scoreElement = document.querySelector('.score');
        this.animateNumber(scoreElement, results.score);

        document.getElementById('analysisText').textContent = results.analysis;
        document.getElementById('suggestions').innerHTML = results.suggestions
            .map(suggestion => `<p>${suggestion}</p>`)
            .join('');
    }

    animateNumber(element, final, duration = 1500) {
        const start = parseInt(element.textContent) || 0;
        const increment = (final - start) / (duration / 16);
        let current = start;

        const animate = () => {
            current += increment;
            element.textContent = Math.round(current);

            if ((increment > 0 && current < final) || 
                (increment < 0 && current > final)) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = final;
            }
        };

        requestAnimationFrame(animate);
    }

    animateResults() {
        const cards = document.querySelectorAll('.score-card, .analysis-card, .suggestions-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    showError(message) {
        console.error(message);
        alert(message);
    }
}

// Initialize the application
const dayAnalyzer = new DayAnalyzer();