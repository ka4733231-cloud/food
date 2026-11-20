/**
 * Chef Nova - AI Voice Agent & Voice Command Engine
 * Hands-free culinary assistant powered by Web Speech API,
 * dynamic audio synthesizer, and interactive canvas waveform visualizer.
 */

class ChefNovaVoiceAgent {
  constructor() {
    this.recognition = null;
    this.synth = window.speechSynthesis || null;
    this.isListening = false;
    this.isSpeaking = false;
    this.activeVoice = null;
    this.audioCtx = null;
    this.canvas = null;
    this.ctx = null;
    this.animId = null;
    this.currentStep = 0;
    this.cookingSteps = [];
    this.timerId = null;

    this.initSpeechRecognition();
    this.initVoices();
  }

  /**
   * Initialize Web Speech Recognition
   */
  initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.playBeep(440, 0.1); // 440Hz wake chime
        this.updateUIStatus('Listening for your cooking command…', true);
        this.startVisualizer();
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        this.appendMessage('user', transcript);
        this.handleVoiceCommand(transcript);
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        this.updateUIStatus('Voice paused. Click microphone to speak.', false);
        this.stopVisualizer();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (!this.isSpeaking) {
          this.updateUIStatus('Ready for your command', false);
          this.stopVisualizer();
        }
      };
    }
  }

  /**
   * Load and select the most natural speech synthesis voice
   */
  initVoices() {
    if (!this.synth) return;
    const setVoice = () => {
      const voices = this.synth.getVoices();
      // Prefer Google or Natural English voices
      this.activeVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Victoria')) && v.lang.startsWith('en')) ||
                         voices.find(v => v.lang.startsWith('en')) ||
                         voices[0];
    };

    setVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = setVoice;
    }
  }

  /**
   * Synthesize audio chime using Web Audio API
   */
  playBeep(freq = 440, duration = 0.15, type = 'sine') {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.audioCtx) this.audioCtx = new AudioContext();

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext might require user gesture in some browsers
    }
  }

  /**
   * Play completion fanfare for timer / recipe finish
   */
  playSuccessFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      setTimeout(() => this.playBeep(freq, 0.25, 'triangle'), index * 140);
    });
  }

  /**
   * Speak a reply aloud
   */
  speak(text, onComplete = null) {
    if (!this.synth) return;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.activeVoice) utterance.voice = this.activeVoice;
    utterance.rate = 1.02;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.startVisualizer();
      this.updateUIStatus('Chef Nova is speaking…', true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.stopVisualizer();
      this.updateUIStatus('Ready for your command', false);
      if (onComplete) onComplete();
    };

    this.synth.speak(utterance);
    this.appendMessage('agent', text);
  }

  /**
   * Stop speaking immediately
   */
  stopSpeaking() {
    if (this.synth) this.synth.cancel();
    this.isSpeaking = false;
    this.stopVisualizer();
  }

  /**
   * Toggle listening on/off
   */
  toggleListening() {
    if (!this.recognition) {
      this.speak("Speech recognition is not supported in this browser mode. You can still type your questions or use the buttons!");
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
      } catch (e) {
        // Recognition already started or restarting
      }
    }
  }

  /**
   * Process Natural Language Voice Commands
   */
  handleVoiceCommand(rawText) {
    const text = rawText.toLowerCase();

    // 1. Navigation / Step commands
    if (text.includes('next step') || text.includes('next')) {
      if (window.appController && window.appController.nextStep) {
        window.appController.nextStep();
        return;
      }
    }

    if (text.includes('previous step') || text.includes('go back') || text.includes('previous')) {
      if (window.appController && window.appController.prevStep) {
        window.appController.prevStep();
        return;
      }
    }

    if (text.includes('repeat') || text.includes('read step') || text.includes('again')) {
      if (window.appController && window.appController.repeatStep) {
        window.appController.repeatStep();
        return;
      }
    }

    // 2. Ingredients reading
    if (text.includes('ingredients') || text.includes('what do i need')) {
      if (window.appController && window.appController.readIngredients) {
        window.appController.readIngredients();
        return;
      }
    }

    // 3. Search and recipe finding
    if (text.startsWith('search') || text.startsWith('find') || text.includes('how to make')) {
      const query = text.replace(/^(search for|search|find recipes with|find recipes for|find|how to make)/i, '').trim();
      this.speak(`Searching delicious recipes for ${query}.`);
      if (window.appController) {
        window.appController.executeSearch(query);
      }
      return;
    }

    // 4. Timer command (e.g. "set a timer for 5 minutes")
    const timerMatch = text.match(/timer (?:for )?(\d+) (minute|min|second|sec)/i);
    if (timerMatch) {
      const val = parseInt(timerMatch[1], 10);
      const unit = timerMatch[2].startsWith('sec') ? 1 : 60;
      const totalSeconds = val * unit;
      this.startCookingTimer(totalSeconds, `${val} ${timerMatch[2]}`);
      return;
    }

    // 5. Daily Food / Meal Planner command
    if (text.includes('daily food') || text.includes('meal plan') || text.includes('what should i eat today')) {
      this.speak("Opening your Daily Food Planner. You can generate a personalized breakfast, lunch, and dinner routine!");
      const plannerSection = document.getElementById('planner');
      if (plannerSection) plannerSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // 6. Food Image Scanner
    if (text.includes('scan food') || text.includes('take photo') || text.includes('camera') || text.includes('analyze')) {
      this.speak("Opening the AI Food Scanner. Snap or upload an image and our machine learning model will detect your ingredients.");
      const scannerSection = document.getElementById('vision-scanner');
      if (scannerSection) scannerSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // 7. General Cooking Knowledge & Smalltalk
    if (text.includes('who are you') || text.includes('what can you do')) {
      this.speak("I am Chef Nova, your AI culinary assistant! I can guide you through recipes hands-free, set cooking timers, analyze food photos with our ML model, and plan your daily meals.");
      return;
    }

    if (text.includes('substitute') || text.includes('replacement')) {
      this.speak("For dairy butter, you can use olive oil, coconut oil, or applesauce in baking. For eggs in baking, 1 tablespoon of ground flaxseed with 3 tablespoons of water works wonders!");
      return;
    }

    // Default conversational reply
    this.speak(`I heard: "${rawText}". You can say "Search pasta", "Next step", "Set a timer for 10 minutes", or "Plan daily food".`);
  }

  /**
   * Start a live cooking timer with audio alarm
   */
  startCookingTimer(seconds, label) {
    if (this.timerId) clearInterval(this.timerId);
    this.speak(`Timer set for ${label}. Happy cooking!`);

    let remaining = seconds;
    const timerDisplay = document.getElementById('voice-timer-display');
    if (timerDisplay) timerDisplay.classList.remove('hidden');

    this.timerId = setInterval(() => {
      remaining--;
      if (timerDisplay) {
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        timerDisplay.textContent = `⏱ ${m}:${s < 10 ? '0' : ''}${s}`;
      }

      if (remaining <= 0) {
        clearInterval(this.timerId);
        this.playSuccessFanfare();
        this.speak(`Ding! Your ${label} cooking timer is finished!`);
        if (timerDisplay) timerDisplay.textContent = '⏱ Timer Finished!';
      }
    }, 1000);
  }

  /**
   * Dynamic Soundwave Canvas Visualizer
   */
  setupCanvas(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
  }

  startVisualizer() {
    if (!this.canvas || this.animId) return;
    let phase = 0;

    const render = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const w = this.canvas.width;
      const h = this.canvas.height;
      const mid = h / 2;

      this.ctx.beginPath();
      this.ctx.strokeStyle = this.isListening ? '#22c55e' : (this.isSpeaking ? '#f59e0b' : '#15803d');
      this.ctx.lineWidth = 3;

      for (let x = 0; x < w; x++) {
        const frequency = 0.05;
        const amplitude = (this.isListening || this.isSpeaking) ? 18 * Math.sin(phase * 0.2) : 4;
        const y = mid + Math.sin(x * frequency + phase) * amplitude * Math.sin(x / w * Math.PI);
        if (x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();

      phase += 0.12;
      this.animId = requestAnimationFrame(render);
    };

    this.animId = requestAnimationFrame(render);
  }

  stopVisualizer() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * UI Helpers
   */
  updateUIStatus(statusText, isEngaged) {
    const el = document.getElementById('voice-status-text');
    if (el) el.textContent = statusText;

    const orb = document.getElementById('voice-orb-btn');
    if (orb) {
      orb.style.boxShadow = isEngaged 
        ? '0 0 30px rgba(34, 197, 94, 0.8), 0 0 10px rgba(245, 158, 11, 0.5)'
        : '0 10px 25px rgba(21, 128, 61, 0.45)';
    }
  }

  appendMessage(sender, text) {
    const container = document.getElementById('voice-messages-log');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = `voice-msg ${sender}`;
    msg.textContent = (sender === 'agent' ? '🧑‍🍳 ' : '🗣️ ') + text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }
}

// Global instance
window.chefNova = new ChefNovaVoiceAgent();
