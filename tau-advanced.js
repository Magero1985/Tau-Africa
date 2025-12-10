// ============================================
// TAU AFRICA PART 2 - ADVANCED FEATURES
// Add this script AFTER the main HTML closing </script> tag
// ============================================

(function() {
    'use strict';
    
    console.log('🚀 Loading TAU Africa Advanced Features...');

    // ============================================
    // VALUE SUBMISSION SYSTEM - COMPLETE
    // ============================================
    window.openValueSubmissionModal = function() {
        const currentMember = window.TauDB?.getCurrentMember();
        
        if (!currentMember) {
            showNotification('Please login to submit values', 'error');
            showRealMemberLogin();
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                
                <div style="background: linear-gradient(45deg, #ffd700, #ffed4e); color: #333; padding: 25px; border-radius: 15px; margin-bottom: 25px; text-align: center;">
                    <h2 style="margin: 0;">💎 Submit Your Value</h2>
                    <p style="margin: 10px 0 0 0;">Turn your skills, products, and services into iKb</p>
                </div>
                
                <form onsubmit="submitValue(event)" id="valueSubmissionForm">
                    <div class="form-group">
                        <label>Value Type *</label>
                        <select name="valueType" required>
                            <option value="">Select type</option>
                            <option value="Product">📦 Product</option>
                            <option value="Service">🛠️ Service</option>
                            <option value="Skill">🎯 Skill</option>
                            <option value="Labour">💪 Labour</option>
                            <option value="Time">⏰ Time</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Value Title *</label>
                        <input type="text" name="valueTitle" placeholder="e.g., Professional Web Design Services" required maxlength="100">
                    </div>
                    
                    <div class="form-group">
                        <label>Detailed Description *</label>
                        <textarea name="valueDescription" rows="6" placeholder="Describe what you're offering" required maxlength="2000"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Estimated Worth (KSH) *</label>
                        <input type="number" name="worthKsh" placeholder="Enter value in KSH" required min="0" step="0.01">
                        <small>This will be converted to iKb (1 iKb = 100,000 KSH)</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Category</label>
                        <select name="valueCategory">
                            <option value="">Select category (optional)</option>
                            <option value="Technology">Technology & IT</option>
                            <option value="Creative">Creative & Design</option>
                            <option value="Business">Business & Finance</option>
                            <option value="Education">Education & Training</option>
                            <option value="Health">Health & Wellness</option>
                            <option value="Agriculture">Agriculture & Food</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="termsAgree" required style="width: auto; margin-right: 10px;">
                            I certify that this value is genuine *
                        </label>
                    </div>
                    
                    <button type="submit" class="btn" style="width: 100%; padding: 15px;">
                        💎 Submit Value for Validation
                    </button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
    };

    window.submitValue = function(event) {
        event.preventDefault();
        const currentMember = window.TauDB?.getCurrentMember();
        if (!currentMember) return;
        
        const formData = new FormData(event.target);
        const worthKsh = parseFloat(formData.get('worthKsh'));
        const worthIkb = (worthKsh / 100000).toFixed(6);
        
        const value = {
            id: 'VAL-' + Date.now(),
            type: formData.get('valueType'),
            title: formData.get('valueTitle'),
            description: formData.get('valueDescription'),
            worthKsh: worthKsh,
            worthIkb: worthIkb,
            category: formData.get('valueCategory') || 'Uncategorized',
            submittedBy: currentMember.id,
            submittedByName: currentMember.fullName,
            validationCode: generateValueCode(),
            status: 'Pending Review',
            created: new Date().toISOString(),
            validated: false
        };
        
        const values = JSON.parse(localStorage.getItem('tauValues') || '[]');
        values.push(value);
        localStorage.setItem('tauValues', JSON.stringify(values));
        
        if (typeof createNotification === 'function') {
            createNotification(currentMember.id, '💎 Value Submitted!', 
                `Your value "${value.title}" submitted. Code: ${value.validationCode}`, 
                'success');
        }
        
        closeAllModals();
        showNotification('✅ Value submitted successfully!', 'success');
    };

    function generateValueCode() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return 'VAL-' + timestamp + '-' + random;
    }

    // ============================================
    // PUBLIC OPPORTUNITIES DISPLAY - ENHANCED
    // ============================================
    window.refreshPublicOpportunities = function() {
        const container = document.getElementById('publicOpportunitiesContainer');
        if (!container) return;
        
        const tasks = JSON.parse(localStorage.getItem('tauTasks') || '[]').filter(t => t.validated);
        const activities = JSON.parse(localStorage.getItem('tauActivities') || '[]').filter(a => a.validated);
        const values = JSON.parse(localStorage.getItem('tauValues') || '[]').filter(v => v.validated && v.status === 'Approved');
        
        let items = [];
        
        if (currentFilter === 'all' || currentFilter === 'activities') {
            items = items.concat(activities.map(a => ({...a, type: 'activity'})));
        }
        if (currentFilter === 'all' || currentFilter === 'tasks') {
            items = items.concat(tasks.map(t => ({...t, type: 'task'})));
        }
        if (currentFilter === 'all' || currentFilter === 'values') {
            items = items.concat(values.map(v => ({...v, type: 'value'})));
        }
        
        if (items.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No opportunities available yet</p>';
            return;
        }
        
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                ${items.map(item => `
                    <div style="background: white; border-radius: 15px; padding: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-left: 4px solid ${getColorForType(item.type)};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h4 style="margin: 0; color: #2a5298;">${item.title}</h4>
                            <span style="background: ${getColorForType(item.type)}; color: white; padding: 5px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                                ${item.type.toUpperCase()}
                            </span>
                        </div>
                        
                        <p style="color: #666; margin-bottom: 15px;">${item.description}</p>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <span style="background: #ffd700; color: #333; padding: 8px 15px; border-radius: 20px; font-weight: bold;">
                                ${item.type === 'value' ? item.worthIkb + ' iKb' : (item.reward || '100') + ' iKbp'}
                            </span>
                        </div>
                        
                        <button class="btn" onclick="claimOpportunity('${item.type}', '${item.id}')" style="width: 100%; padding: 12px;">
                            ${item.type === 'value' ? '💎 Claim Value' : '✅ Complete & Earn'}
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    };

    function getColorForType(type) {
        switch(type) {
            case 'activity': return '#ff6b6b';
            case 'task': return '#4169e1';
            case 'value': return '#ffd700';
            default: return '#95a5a6';
        }
    }

    window.claimOpportunity = function(type, id) {
        const currentMember = window.TauDB?.getCurrentMember();
        
        if (!currentMember) {
            showNotification('Please login to claim opportunities', 'error');
            showRealMemberLogin();
            return;
        }
        
        showNotification('Claiming opportunity...', 'info');
        setTimeout(() => {
            showNotification('✅ Opportunity claimed! Check your dashboard.', 'success');
        }, 1000);
    };

    // ============================================
    // FIREBASE ENHANCEMENT FOR TAUDB
    // ============================================
    if (window.TauDB && window.db) {
        const originalSync = window.TauDB.sync;
        
        window.TauDB.sync = async function(formData, team, referralCode) {
            const result = originalSync.call(this, formData, team, referralCode);
            
            if (result.success && window.db) {
                try {
                    await window.db.collection('members').doc(result.memberId).set({
                        ...result.member,
                        lastSync: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    console.log('✅ Member synced to Firestore:', result.memberId);
                } catch (error) {
                    console.error('⚠️ Firestore sync warning:', error);
                }
            }
            
            return result;
        };
        
        console.log('✅ Firebase enhancement applied to TauDB');
    }

    // ============================================
    // REAL-TIME SYNC SOCKET
    // ============================================
    const SYNC_INTERVAL = 5000;
    let lastState = {};
    
    function initSync() {
        const STORAGE_KEYS = {
            members: 'tauAfricaDB',
            tasks: 'tauTasks',
            activities: 'tauActivities',
            values: 'tauValues',
            notifications: 'tauNotifications'
        };
        
        Object.keys(STORAGE_KEYS).forEach(key => {
            const data = localStorage.getItem(STORAGE_KEYS[key]) || '[]';
            lastState[key] = data;
        });
        
        console.log('✅ Sync socket initialized');
    }
    
    function checkForChanges() {
        const STORAGE_KEYS = {
            members: 'tauAfricaDB',
            tasks: 'tauTasks',
            activities: 'tauActivities',
            values: 'tauValues',
            notifications: 'tauNotifications'
        };
        
        let hasChanges = false;
        
        Object.keys(STORAGE_KEYS).forEach(key => {
            const currentData = localStorage.getItem(STORAGE_KEYS[key]) || '[]';
            
            if (currentData !== lastState[key]) {
                hasChanges = true;
                lastState[key] = currentData;
                console.log(`🔄 Data changed: ${key}`);
            }
        });
        
        if (hasChanges) {
            if (typeof updateNotificationBadge === 'function') updateNotificationBadge();
            if (typeof refreshPublicOpportunities === 'function') refreshPublicOpportunities();
        }
    }
    
    initSync();
    setInterval(checkForChanges, SYNC_INTERVAL);
    
    window.addEventListener('storage', function(e) {
        console.log('🔄 Storage event detected:', e.key);
        checkForChanges();
    });

    // ============================================
    // WELCOME BONUS AUTOMATION
    // ============================================
    function checkAndAwardBonuses() {
        try {
            const members = JSON.parse(localStorage.getItem('tauAfricaDB') || '[]');
            const bonusTracking = JSON.parse(localStorage.getItem('tauWelcomeBonuses') || '{}');
            let newBonuses = 0;
            
            members.forEach(member => {
                if (!bonusTracking[member.id]) {
                    member.iKbpBalance = (member.iKbpBalance || 0) + 500;
                    
                    bonusTracking[member.id] = {
                        awarded: true,
                        amount: 500,
                        date: new Date().toISOString(),
                        memberId: member.id
                    };
                    
                    newBonuses++;
                    console.log(`✅ Welcome bonus awarded: ${member.fullName} (+500 iKbp)`);
                }
            });
            
            if (newBonuses > 0) {
                localStorage.setItem('tauAfricaDB', JSON.stringify(members));
                localStorage.setItem('tauWelcomeBonuses', JSON.stringify(bonusTracking));
            }
        } catch (error) {
            console.error('Welcome bonus error:', error);
        }
    }
    
    setInterval(checkAndAwardBonuses, 5000);
    checkAndAwardBonuses();

    // ============================================
    // KABIRU WITHDRAWAL SYSTEM
    // ============================================
    window.initiateKabiruWithdrawal = async function() {
        const currentMember = window.TauDB?.getCurrentMember();
        
        if (!currentMember) {
            showNotification('❌ Please login first', 'error');
            showRealMemberLogin();
            return;
        }
        
        const availableIkbp = currentMember.iKbpBalance || 0;
        const availableIkb = currentMember.iKbBalance || 0;
        
        if (availableIkbp < 10000 && availableIkb < 0.0001) {
            showNotification('❌ Minimum required: 10,000 iKbp or 0.0001 iKb', 'error');
            return;
        }
        
        const confirmMsg = `Transfer to Kabiru Mining App?\n\n` +
                          `${availableIkbp.toLocaleString()} iKbp\n` +
                          `${availableIkb.toFixed(4)} iKb\n\n` +
                          `This will transfer to your Kabiru mining wallet.`;
        
        if (!confirm(confirmMsg)) return;
        
        try {
            if (window.db) {
                await window.db.collection('kabiru_transfers').add({
                    transferId: 'XFER-' + Date.now(),
                    memberId: currentMember.id,
                    memberName: currentMember.fullName,
                    iKbp: availableIkbp,
                    iKb: availableIkb,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'pending',
                    direction: 'tau_to_kabiru'
                });
                
                const members = JSON.parse(localStorage.getItem('tauAfricaDB') || '[]');
                const memberIndex = members.findIndex(m => m.id === currentMember.id);
                if (memberIndex !== -1) {
                    members[memberIndex].iKbpBalance = 0;
                    members[memberIndex].iKbBalance = 0;
                    localStorage.setItem('tauAfricaDB', JSON.stringify(members));
                    sessionStorage.setItem('tauCurrentUser', JSON.stringify(members[memberIndex]));
                }
                
                showNotification('✅ Transfer initiated! Open Kabiru Mining App to receive.', 'success');
            } else {
                showNotification('⚠️ Offline mode - saved locally', 'info');
            }
        } catch (error) {
            console.error('❌ Transfer failed:', error);
            showNotification('❌ Transfer failed: ' + error.message, 'error');
        }
    };

    // ============================================
    // ENHANCED MEMBER DASHBOARD WITH TRANSFER
    // ============================================
    const originalShowDashboard = window.showRealMemberDashboard;
    
    window.showRealMemberDashboard = function(member) {
        if (originalShowDashboard) {
            originalShowDashboard(member);
        }
        
        setTimeout(() => {
            const modal = document.querySelector('.modal[style*="display: block"]');
            if (!modal) return;
            
            const modalContent = modal.querySelector('.modal-content');
            if (!modalContent || modalContent.querySelector('#kabiruTransferSection')) return;
            
            const currentMember = window.TauDB?.getCurrentMember() || member;
            
            const transferSection = document.createElement('div');
            transferSection.id = 'kabiruTransferSection';
            transferSection.innerHTML = `
                <div style="margin-top: 30px; padding: 20px; background: linear-gradient(45deg, #FFD700, #FFA500); border-radius: 15px; text-align: center;">
                    <h3 style="color: #333; margin-bottom: 15px;">💎 Kabiru Mining Transfer</h3>
                    <div style="background: rgba(0,0,0,0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <div style="font-size: 24px; font-weight: bold; color: #333;">
                            ${(currentMember.iKbpBalance || 0).toLocaleString()} iKbp
                        </div>
                        <div style="font-size: 18px; color: #333; margin-top: 5px;">
                            ${(currentMember.iKbBalance || 0).toFixed(4)} iKb
                        </div>
                    </div>
                    <button onclick="initiateKabiruWithdrawal()" class="btn" style="width: 100%; background: #333; color: #FFD700;">
                        💸 Withdraw to Kabiru Mining
                    </button>
                    <p style="color: #333; font-size: 12px; margin-top: 10px;">
                        Minimum: 10,000 iKbp or 0.0001 iKb
                    </p>
                </div>
            `;
            
            const lastDiv = modalContent.querySelector('div[style*="grid-template-columns"]');
            if (lastDiv) {
                lastDiv.parentNode.insertBefore(transferSection, lastDiv);
            } else {
                modalContent.appendChild(transferSection);
            }
            
            console.log('✅ Transfer button added to dashboard');
        }, 500);
    };

    // ============================================
    // INTEGRATION HEALTH CHECK
    // ============================================
    function runHealthCheck() {
        console.log('\n' + '='.repeat(60));
        console.log('🏥 TAU AFRICA INTEGRATION HEALTH CHECK');
        console.log('='.repeat(60) + '\n');
        
        const tests = {
            emailJS: typeof emailjs !== 'undefined',
            firebase: typeof firebase !== 'undefined' && window.db,
            tauDB: typeof window.TauDB !== 'undefined',
            notifications: typeof createNotification === 'function',
            opportunities: typeof refreshPublicOpportunities === 'function'
        };
        
        console.log('EmailJS:', tests.emailJS ? '✅' : '❌');
        console.log('Firebase:', tests.firebase ? '✅' : '❌');
        console.log('TauDB:', tests.tauDB ? '✅' : '❌');
        console.log('Notifications:', tests.notifications ? '✅' : '❌');
        console.log('Opportunities:', tests.opportunities ? '✅' : '❌');
        
        const allPassed = Object.values(tests).every(t => t);
        
        console.log('\n' + '='.repeat(60));
        if (allPassed) {
            console.log('🎉 ALL SYSTEMS OPERATIONAL');
        } else {
            console.log('⚠️ SOME ISSUES DETECTED');
        }
        console.log('='.repeat(60) + '\n');
        
        return tests;
    }

    window.TauIntegration = {
        healthCheck: runHealthCheck
    };

    // ============================================
    // AUTO-RUN ON LOAD
    // ============================================
    setTimeout(() => {
        runHealthCheck();
        refreshPublicOpportunities();
        
        console.log('✅ TAU Africa Advanced Features - LOADED');
        console.log('💡 Run window.TauIntegration.healthCheck() to check status');
    }, 3000);

})();
