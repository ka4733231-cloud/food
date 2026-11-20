/**
 * Authentication & User Profile Manager
 * Animated login & sign up modal, local storage session persistence,
 * avatar selection, password strength meter, and dietary preference syncing.
 */

class AuthManager {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('pantryplate_user') || 'null');
    this.selectedAvatar = '👨‍🍳';
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  register(name, email, password, avatar = '👨‍🍳', preferences = []) {
    if (!name || !email || !password) {
      throw new Error('Please fill in all required fields.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const user = {
      name,
      email,
      avatar: avatar || this.selectedAvatar,
      preferences,
      favorites: [],
      joinedDate: new Date().toLocaleDateString()
    };

    this.currentUser = user;
    localStorage.setItem('pantryplate_user', JSON.stringify(user));
    this.updateHeaderProfile();
    return user;
  }

  login(email, password) {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    // Check if user matches saved or create active session
    let user = JSON.parse(localStorage.getItem('pantryplate_user') || 'null');
    if (!user || user.email !== email) {
      user = {
        name: email.split('@')[0],
        email: email,
        avatar: this.selectedAvatar || '👨‍🍳',
        preferences: ['Quick & Easy'],
        favorites: [],
        joinedDate: new Date().toLocaleDateString()
      };
    }

    this.currentUser = user;
    localStorage.setItem('pantryplate_user', JSON.stringify(user));
    this.updateHeaderProfile();
    return user;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('pantryplate_user');
    this.updateHeaderProfile();
  }

  calculatePasswordStrength(password) {
    if (!password) return { score: 0, text: '', color: '#e2e8f0' };
    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 10) score += 25;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    let text = 'Weak';
    let color = '#ef4444';
    if (score > 40 && score <= 75) {
      text = 'Medium';
      color = '#f59e0b';
    } else if (score > 75) {
      text = 'Strong & Secure';
      color = '#22c55e';
    }

    return { score, text, color };
  }

  updateHeaderProfile() {
    const accountBtn = document.getElementById('account-open-btn');
    if (!accountBtn) return;

    if (this.isLoggedIn()) {
      accountBtn.innerHTML = `
        <span class="user-avatar-badge">${this.currentUser.avatar || '👨‍🍳'}</span>
        <span>${this.currentUser.name}</span>
        <button id="quick-logout-btn" class="quick-logout" title="Sign Out" style="margin-left:8px;font-size:0.8rem;opacity:0.7;">✕</button>
      `;
      const quickLogout = document.getElementById('quick-logout-btn');
      if (quickLogout) {
        quickLogout.addEventListener('click', (e) => {
          e.stopPropagation();
          this.logout();
        });
      }
    } else {
      accountBtn.innerHTML = `<span>Log in / Sign up</span>`;
    }
  }
}

// Global instance
window.authManager = new AuthManager();
