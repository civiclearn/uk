// ----------------------------
// SETTINGS
// ----------------------------
const QUESTIONS_PER_ROW = 3;

const INLINE_TEST_QUESTIONS = [
  {
    q: "Which Tudor monarch broke with the Roman Catholic Church?",
    a: ["Henry VIII", "Edward VI", "Mary I"],
    correct: 0
  },
  {
    q: "Which document, agreed in 1215, limited the power of the English monarch?",
    a: ["Magna Carta", "Bill of Rights", "Act of Union"],
    correct: 0
  },
  {
    q: "Which battle in 1066 led to Norman rule in England?",
    a: ["The Battle of Hastings", "The Battle of Bosworth", "The Battle of Agincourt"],
    correct: 0
  },
  {
    q: "Which Tudor monarch was known as the 'Virgin Queen'?",
    a: ["Elizabeth I", "Mary I", "Anne Boleyn"],
    correct: 0
  },
  {
    q: "Which English king is closely associated with the Norman Conquest?",
    a: ["William I", "Henry II", "Richard I"],
    correct: 0
  },
  {
    q: "Which conflict between York and Lancaster ended in 1485?",
    a: ["The Wars of the Roses", "The Hundred Years’ War", "The English Civil War"],
    correct: 0
  },
  {
    q: "Which monarch was executed in 1649 after the Civil War?",
    a: ["Charles I", "James II", "George II"],
    correct: 0
  },
  {
    q: "Which event in 1688 strengthened Parliament and limited the monarch’s power?",
    a: ["The Glorious Revolution", "The Restoration", "The Jacobite rising"],
    correct: 0
  },
  {
    q: "Which Act created the Kingdom of Great Britain in 1707?",
    a: ["The Act of Union", "The Bill of Rights", "The Reform Act"],
    correct: 0
  },
  {
    q: "Which change is strongly associated with the Industrial Revolution?",
    a: ["Rapid urbanisation", "The end of the monarchy", "The creation of the EU"],
    correct: 0
  },
  {
    q: "Which city became a major centre of textile manufacturing in the Industrial Revolution?",
    a: ["Manchester", "Canterbury", "York"],
    correct: 0
  },
  {
    q: "Which 19th-century monarch ruled for most of the Victorian era?",
    a: ["Queen Victoria", "Queen Anne", "Elizabeth I"],
    correct: 0
  },
  {
    q: "Which mountain is the highest in the United Kingdom?",
    a: ["Ben Nevis", "Snowdon", "Scafell Pike"],
    correct: 0
  },

  {
    q: "Which UK country has Cardiff as its capital?",
    a: ["Wales", "Scotland", "Northern Ireland"],
    correct: 0
  },
  {
    q: "Which sea lies between Great Britain and Ireland?",
    a: ["The Irish Sea", "The North Sea", "The English Channel"],
    correct: 0
  },
  {
    q: "Which House of Parliament is elected?",
    a: ["The House of Commons", "The House of Lords", "The Privy Council"],
    correct: 0
  },
  {
    q: "Which UK institution debates and passes Acts of Parliament?",
    a: ["Parliament", "The Supreme Court", "The Cabinet Office"],
    correct: 0
  }
];

// ----------------------------
// STATE
// ----------------------------
let correctCount = 0;
let wrongCount = 0;
let answeredCount = 0;
let totalQuestions = INLINE_TEST_QUESTIONS.length;
let currentRow = 0;

// ----------------------------
// UI TARGETS
// ----------------------------
const container = document.getElementById("inline-test-questions");

// ----------------------------
// PROGRESS DISPLAY
// ----------------------------
function updateProgressDisplay() {
  const el = document.getElementById("inline-progress-text");
  if (!el) return;
  el.textContent = `Progress: ${answeredCount} / ${totalQuestions} questions`;
}

function updateProgressBar() {
  const bar = document.getElementById("inline-progressbar");
  if (!bar) return;
  const pct = (answeredCount / totalQuestions) * 100;
  bar.style.width = pct + "%";
}

// ----------------------------
// UTILITIES
// ----------------------------
function shuffleAnswers(question) {
  const combined = question.a.map((opt, index) => ({
    text: opt,
    isCorrect: index === question.correct
  }));

  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  question.a = combined.map(i => i.text);
  question.correct = combined.findIndex(i => i.isCorrect);
}

function createDonutChart() {
  const pct = Math.round((correctCount / totalQuestions) * 100);
  const C = 2 * Math.PI * 40;

  return `
    <div class="donut-wrapper">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="#ebe6ff" stroke-width="12" fill="none"></circle>
        <circle cx="50" cy="50" r="40" stroke="#6d4aff" stroke-width="12" fill="none"
          stroke-dasharray="${(pct / 100) * C} ${(1 - pct / 100) * C}"
          transform="rotate(-90 50 50)" stroke-linecap="round"></circle>
      </svg>
      <div class="donut-center">${pct}%</div>
    </div>
  `;
}

function createEndCard() {
  const pct = Math.round((correctCount / totalQuestions) * 100);
  const card = document.createElement("div");
  card.className = "inline-question-card end-card";

  const title =
    pct >= 80 ? "Excellent work!" :
    pct >= 50 ? "Good progress!" :
    pct >= 25 ? "A solid start" :
    "Keep practising";

  card.innerHTML = `
    <h3>${title}</h3>
    ${createDonutChart()}
    <p>
      You’ve completed the free practice questions.<br>
      Get full access to <strong>hundreds of Life in the UK Test–style questions</strong>,
      realistic practice sessions, and progress tracking.
    </p>
    <a href="https://civiclearn.com/uk/checkout.html" class="hero-primary-btn">
      Get full access
    </a>
  `;

  return card;
}

// ----------------------------
// BUILD ROWS
// ----------------------------
const rows = [];
for (let i = 0; i < totalQuestions; i += QUESTIONS_PER_ROW) {
  rows.push(INLINE_TEST_QUESTIONS.slice(i, i + QUESTIONS_PER_ROW));
}

INLINE_TEST_QUESTIONS.forEach(q => shuffleAnswers(q));

// ----------------------------
// RENDERING
// ----------------------------
function renderRow(rowIndex) {
  if (!rows[rowIndex]) return;

  rows[rowIndex].forEach((q, offset) => {
    const absoluteIndex = rowIndex * QUESTIONS_PER_ROW + offset;
    container.appendChild(createQuestionCard(q, absoluteIndex));
  });
}

function createQuestionCard(questionObj, absoluteIndex) {
  const card = document.createElement("div");
  card.className = "inline-question-card";

  const title = document.createElement("h3");
  title.textContent = questionObj.q;

  const feedback = document.createElement("div");
  feedback.className = "inline-feedback";

  card.append(title);

  questionObj.a.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "inline-option-btn";
    btn.textContent = opt;

    btn.onclick = () => {
      answeredCount++;
      updateProgressDisplay();
      updateProgressBar();

      if (i === questionObj.correct) {
        correctCount++;
        feedback.textContent = "Correct!";
        feedback.classList.add("inline-correct");
      } else {
        wrongCount++;
        feedback.textContent = "Correct answer: " + questionObj.a[questionObj.correct];
        feedback.classList.add("inline-wrong");
      }

      card.querySelectorAll("button").forEach(b => (b.disabled = true));
      card.appendChild(feedback);

      const isLastQuestion = absoluteIndex === totalQuestions - 1;
      if (isLastQuestion) {
        setTimeout(() => container.appendChild(createEndCard()), 300);
      }

      const isLastInRow =
        (absoluteIndex + 1) % QUESTIONS_PER_ROW === 0 &&
        absoluteIndex !== totalQuestions - 1;

      if (isLastInRow) {
        currentRow++;
        renderRow(currentRow);
      }
    };

    card.appendChild(btn);
  });

  return card;
}

// ----------------------------
// INITIAL RENDER
// ----------------------------
renderRow(0);
updateProgressDisplay();
updateProgressBar();
