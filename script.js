// ==========================================================================
// SPA Navigation Logic
// ==========================================================================
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const closeDrawerBtn = document.getElementById('close-drawer');
const mobileDrawer = document.getElementById('mobile-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');

if (mobileMenuToggle && mobileDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
        if (drawerOverlay) drawerOverlay.classList.add('open');
        document.body.classList.add('drawer-open');
    });
}

function closeMobileDrawer() {
    if (mobileDrawer) {
        mobileDrawer.classList.remove('open');
        if (drawerOverlay) drawerOverlay.classList.remove('open');
        document.body.classList.remove('drawer-open');
    }
}

if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeMobileDrawer);
}

// Close drawer if clicking the overlay backdrop
if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeMobileDrawer);
}

function navigateTo(targetId) {
    // Update nav links for both desktop and mobile drawer
    document.querySelectorAll('.nav-links a, .drawer-links a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.target === targetId) {
            link.classList.add('active');
        }
    });

    // Update sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Lazy initialize chart if navigating to dashboard
        if (targetId === 'dashboard' && !window.chartInitialized) {
            initChart();
            window.chartInitialized = true;
        }
    }

    // Automatically close mobile menu when navigating
    closeMobileDrawer();
}

// Attach event listeners to nav links
document.querySelectorAll('.nav-links a, .drawer-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // Use currentTarget because link has nested icons/spans in some contexts
        navigateTo(e.currentTarget.dataset.target);
    });
});

// ==========================================================================
// Dashboard Chart (Chart.js)
// ==========================================================================
let progressChartInstance = null;
function initChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;

    // Destroy existing chart instance if it exists to prevent errors
    if (progressChartInstance) {
        progressChartInstance.destroy();
    }

    // Gradient fill
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');

    progressChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [{
                label: 'Volume (lbs lifted)',
                data: [12000, 13500, 13200, 14800, 16000, 18500],
                borderColor: '#00f0ff',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#b026ff',
                pointBorderColor: '#fff',
                pointRadius: 5,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9ba1a6' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ba1a6' }
                }
            }
        }
    });
}

// ==========================================================================
// AI Generator Mock Logic
// ==========================================================================
const daysInput = document.getElementById('days');
const daysVal = document.getElementById('days-val');
if (daysInput && daysVal) {
    daysInput.addEventListener('input', (e) => {
        daysVal.textContent = e.target.value;
    });
}

const aiForm = document.getElementById('ai-form');
if (aiForm) {
    aiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const goal = document.getElementById('goal').options[document.getElementById('goal').selectedIndex].text;
        const days = document.getElementById('days').value;
        
        // UI State changes
        const loadingState = document.getElementById('loading-state');
        const resultsContent = document.getElementById('results-content');
        
        loadingState.classList.remove('hidden');
        resultsContent.classList.add('hidden');
        
        // Simulate API call delay
        setTimeout(() => {
            loadingState.classList.add('hidden');
            
            // Generate mock HTML based on inputs
            resultsContent.innerHTML = `
                <div class="generated-plan">
                    <h3>Your AuraFit Masterplan: <span class="neon-text">${goal}</span></h3>
                    <p style="margin-bottom: 2rem; color: var(--text-muted);">Optimized for ${days} days a week based on your profile.</p>
                    
                    <div class="plan-day">
                        <h4>Day 1: Push / Anterior Chain</h4>
                        <ul class="plan-list">
                            <li>Barbell Bench Press: 4 sets x 8-10 reps</li>
                            <li>Overhead Dumbbell Press: 3 sets x 10-12 reps</li>
                            <li>Incline Chest Flyes: 3 sets x 12-15 reps</li>
                            <li>Tricep Rope Pushdowns: 3 sets x 15 reps</li>
                        </ul>
                    </div>
                    
                    <div class="plan-day">
                        <h4>Day 2: Pull / Posterior Chain</h4>
                        <ul class="plan-list">
                            <li>Deadlifts: 4 sets x 5-8 reps</li>
                            <li>Lat Pulldowns: 3 sets x 10-12 reps</li>
                            <li>Seated Cable Rows: 3 sets x 10-12 reps</li>
                            <li>Barbell Curls: 3 sets x 12 reps</li>
                        </ul>
                    </div>
                    
                    <button class="btn btn-secondary w-100" style="margin-top: 1rem;" onclick="alert('Plan saved to your dashboard!')">
                        Save to Dashboard
                    </button>
                </div>
            `;
            resultsContent.classList.remove('hidden');
        }, 2000);
    });
}

// ==========================================================================
// Chatbot Logic
// ==========================================================================
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input-field');
const sendChatBtn = document.getElementById('send-chat');

if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
    });
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChat() {
    const text = chatInput.value.trim();
    if (!text) return;

    // User message
    appendMessage(text, 'user');
    chatInput.value = '';

    // Mock bot response
    setTimeout(() => {
        const responses = [
            "Great question! For optimal hypertrophy, aim for 8-12 reps.",
            "Make sure you're getting enough protein! I recommend 1.6g per kg of body weight.",
            "Your form is crucial. Keep your core tight and back straight.",
            "I've logged that. You're doing great, keep up the 12-day streak!"
        ];
        const reply = responses[Math.floor(Math.random() * responses.length)];
        appendMessage(reply, 'bot');
    }, 1000);
}

if (sendChatBtn) {
    sendChatBtn.addEventListener('click', handleChat);
}
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });
}

// ==========================================================================
// Exercise Library Logic
// ==========================================================================
const exerciseDatabase = [
    {
        id: 1,
        title: 'Barbell Bench Press',
        muscle: 'chest',
        difficulty: 'intermediate',
        goal: 'strength',
        img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        instructions: [
            'Lie flat on the bench with your eyes under the bar.',
            'Grip the bar slightly wider than shoulder-width apart.',
            'Unrack the bar and hold it straight over your chest.',
            'Lower the bar slowly to your mid-chest.',
            'Press the bar back up to the starting position.'
        ],
        mistakes: [
            'Bouncing the bar off your chest.',
            'Flaring elbows out too much (can cause shoulder injury).',
            'Lifting hips off the bench.'
        ],
        tip: 'Retract your scapula (squeeze shoulder blades together) to create a stable base and protect your shoulders.'
    },
    {
        id: 2,
        title: 'Deadlift',
        muscle: 'back',
        difficulty: 'advanced',
        goal: 'strength',
        img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        instructions: [
            'Stand with mid-foot under the barbell.',
            'Bend over and grab the bar with a shoulder-width grip.',
            'Bend your knees until your shins touch the bar.',
            'Lift your chest up and straighten your lower back.',
            'Stand up with the weight, driving through your heels.'
        ],
        mistakes: [
            'Rounding the lower back (cat back).',
            'Letting the bar drift away from the legs.',
            'Jerking the weight off the floor.'
        ],
        tip: 'Think about pushing the floor away with your legs rather than pulling the bar up with your back.'
    },
    {
        id: 3,
        title: 'Bulgarian Split Squat',
        muscle: 'legs',
        difficulty: 'intermediate',
        goal: 'hypertrophy',
        img: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        instructions: [
            'Stand a couple of feet in front of a bench.',
            'Rest the top of one foot on the bench behind you.',
            'Lower your hips until your front thigh is parallel to the floor.',
            'Keep your chest up and core engaged.',
            'Push back up to the starting position.'
        ],
        mistakes: [
            'Front knee caving inward.',
            'Too short or too long of a stance.',
            'Leaning too far forward.'
        ],
        tip: 'For more quad emphasis, keep your torso upright. For more glute emphasis, lean your torso slightly forward.'
    },
    {
        id: 4,
        title: 'Overhead Press',
        muscle: 'shoulders',
        difficulty: 'intermediate',
        goal: 'strength',
        img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        instructions: [
            'Hold the barbell at shoulder level with a pronated grip.',
            'Brace your core and squeeze your glutes.',
            'Press the bar directly overhead until your arms are locked out.',
            'Shrug your shoulders slightly at the top.',
            'Lower the bar under control back to the starting position.'
        ],
        mistakes: [
            'Excessive arching of the lower back.',
            'Pushing the bar out in front rather than straight up.',
            'Using leg drive (that makes it a push press).'
        ],
        tip: 'Squeeze your glutes hard before pressing to prevent your lower back from arching.'
    },
    {
        id: 5,
        title: 'Plank',
        muscle: 'core',
        difficulty: 'beginner',
        goal: 'endurance',
        img: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        instructions: [
            'Start in a push-up position, but resting on your forearms.',
            'Ensure your elbows are directly beneath your shoulders.',
            'Keep your body in a straight line from head to heels.',
            'Engage your core and squeeze your glutes.',
            'Hold this position for the desired time.'
        ],
        mistakes: [
            'Letting hips sag toward the floor.',
            'Piking hips too high in the air.',
            'Forgetting to breathe.'
        ],
        tip: 'Actively pull your elbows toward your toes to dramatically increase core tension.'
    },
    {
        id: 6,
        title: 'Cable Tricep Pushdown',
        muscle: 'arms',
        difficulty: 'beginner',
        goal: 'hypertrophy',
        img: 'https://images.unsplash.com/photo-1533681474261-b4f5351a0216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        instructions: [
            'Attach a rope or straight bar to a high pulley.',
            'Grip the attachment and pin your elbows to your sides.',
            'Push the attachment down until your arms are fully extended.',
            'Squeeze your triceps at the bottom.',
            'Slowly return to the starting position.'
        ],
        mistakes: [
            'Letting elbows flare forward or outward.',
            'Using momentum or bodyweight to push the weight down.',
            'Not achieving full extension.'
        ],
        tip: 'Keep your chest up and shoulders pulled back to isolate the triceps better.'
    }
];

const exerciseGrid = document.getElementById('exercise-grid');
const filterMuscle = document.getElementById('filter-muscle');
const filterDiff = document.getElementById('filter-difficulty');
const filterGoal = document.getElementById('filter-goal');

const modalOverlay = document.getElementById('exercise-modal');
const closeModalBtn = document.getElementById('close-modal');

// Render Exercises
function renderExercises(exercises) {
    if (!exerciseGrid) return;
    
    exerciseGrid.innerHTML = '';
    
    if (exercises.length === 0) {
        exerciseGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No exercises found matching your criteria.</p>';
        return;
    }
    
    exercises.forEach(ex => {
        const card = document.createElement('div');
        card.className = 'glass-card exercise-card';
        card.onclick = () => openModal(ex);
        
        card.innerHTML = `
            <div class="exercise-img">
                <img src="${ex.img}" alt="${ex.title}">
                <div class="exercise-img-overlay"></div>
            </div>
            <div class="exercise-info">
                <h3>${ex.title}</h3>
                <div class="tags">
                    <span class="tag tag-muscle">${ex.muscle}</span>
                    <span class="tag tag-diff">${ex.difficulty}</span>
                </div>
            </div>
        `;
        exerciseGrid.appendChild(card);
    });
}

// Filter Logic
function applyFilters() {
    const muscle = filterMuscle ? filterMuscle.value : 'all';
    const diff = filterDiff ? filterDiff.value : 'all';
    const goal = filterGoal ? filterGoal.value : 'all';
    
    const filtered = exerciseDatabase.filter(ex => {
        return (muscle === 'all' || ex.muscle === muscle) &&
               (diff === 'all' || ex.difficulty === diff) &&
               (goal === 'all' || ex.goal === goal);
    });
    
    renderExercises(filtered);
}

if (filterMuscle) filterMuscle.addEventListener('change', applyFilters);
if (filterDiff) filterDiff.addEventListener('change', applyFilters);
if (filterGoal) filterGoal.addEventListener('change', applyFilters);

// Modal Logic
function openModal(ex) {
    if (!modalOverlay) return;
    
    document.getElementById('modal-img').src = ex.img;
    document.getElementById('modal-img').alt = ex.title;
    document.getElementById('modal-title').textContent = ex.title;
    document.getElementById('modal-muscle').textContent = ex.muscle;
    document.getElementById('modal-diff').textContent = ex.difficulty;
    
    const instructionsList = document.getElementById('modal-instructions');
    instructionsList.innerHTML = '';
    ex.instructions.forEach(inst => {
        const li = document.createElement('li');
        li.textContent = inst;
        instructionsList.appendChild(li);
    });
    
    const mistakesList = document.getElementById('modal-mistakes');
    mistakesList.innerHTML = '';
    ex.mistakes.forEach(mistake => {
        const li = document.createElement('li');
        li.textContent = mistake;
        mistakesList.appendChild(li);
    });
    
    document.getElementById('modal-tip').textContent = ex.tip;
    
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
    });
}

// Close modal on outside click
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// Initial render
// We should only render initially if the library section exists.
// The render function checks for exerciseGrid.
document.addEventListener('DOMContentLoaded', () => {
    renderExercises(exerciseDatabase);
});
// Since this script might run after DOMContentLoaded in a SPA setup sometimes, just call it directly too.
renderExercises(exerciseDatabase);
