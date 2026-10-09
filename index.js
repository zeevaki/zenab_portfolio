let isModalOpen = false;
let contrastToggle = false;
const scaleFactor = 1 / 20;

function moveBackground(event) {
  const shapes = document.querySelectorAll(".shape");
  const x = event.clientX * scaleFactor;
  const y = event.clientY * scaleFactor;

  for (let i = 0; i < shapes.length; ++i) {
    const isOdd = i % 2 !== 0;
    const boolInt = isOdd ? -1 : 1;
    // Added rotate after tutorial
    shapes[i].style.transform = `translate(${x * boolInt}px, ${y * boolInt}px) rotate(${x * boolInt * 10}deg)`
  }
}

function toggleContrast() {
  contrastToggle = !contrastToggle;
  if (contrastToggle) {
    document.body.classList += " dark-theme"
  }
  else {
    document.body.classList.remove("dark-theme")
  }
}

function setCurrency(currency) {
  document.querySelectorAll("[data-pkr]").forEach((el) => {
    el.textContent = el.dataset[currency];
  });
  document.querySelectorAll(".currency__btn").forEach((btn) => {
    btn.classList.toggle("currency__btn--active", btn.dataset.currency === currency);
  });
}

// In the contact popup, website projects are sent to the full project form
// (start.html) instead of a free-text message, so every lead arrives with details.
function updateContactType() {
  const select = document.getElementById("project_type");
  if (!select) return;
  const isProject = select.selectedOptions[0].hasAttribute("data-project");
  document.querySelector(".contact__redirect").hidden = !isProject;
  document.querySelector(".contact__message").hidden = isProject;
}

document.addEventListener("DOMContentLoaded", updateContactType);

function contact(event) {
  event.preventDefault();
  const loading = document.querySelector(".modal__overlay--loading");
  const success = document.querySelector(".modal__overlay--success");
  loading.classList += " modal__overlay--visible";
  // Project type and budget are folded into the message so the existing
  // EmailJS template (name, email, message) delivers them without changes.
  // The sender's email is also repeated at the top of the message, and sent
  // under the common reply-to variable names, so replies can reach them.
  const form = event.target;
  const name = form.user_name.value.trim();
  const email = form.user_email.value.trim();
  const details = [`From: ${name} <${email}>`];
  if (form.project_type) details.push(`Reaching out about: ${form.project_type.value}`);
  if (form.budget && form.budget.value) details.push(`Budget: ${form.budget.value}`);
  const message = `${details.join("\n")}\n\n${form.message.value}`;
  emailjs
    .send(
      "service_qxdnyg4",
      "template_zkdk6zl",
      {
        user_name: name,
        from_name: name,
        name,
        user_email: email,
        reply_to: email,
        email,
        from_email: email,
        message,
      },
      "URaLON_8OTzDkIS1D"
    )
    .then(() => {
      loading.classList.remove("modal__overlay--visible");
      success.classList += " modal__overlay--visible";
    })
    .catch(() => {
      loading.classList.remove("modal__overlay--visible");
      alert(
        "The email service is temporarily unavailable. Please contact me directly at hello@zenab.dev"
      );
    });
}

// Project questionnaire on start.html. Every answer is folded into one
// message, so it goes through the same EmailJS template as the contact form.
function startProject(event) {
  event.preventDefault();
  const form = event.target;
  const button = document.getElementById("brief__submit");
  const field = (name) => (form[name] ? form[name].value.trim() : "");
  const picked = (name) =>
    [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((el) => el.value).join(", ");

  // Checks the browser can't do on its own: at least one language picked,
  // and written answers that aren't just spaces.
  const error = document.querySelector(".brief__error");
  const problem = (message, target) => {
    error.textContent = message;
    error.hidden = false;
    (target.closest(".form__item") || target).appendChild(error);
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const languages = form.querySelector('[data-required-group="languages"]');
  if (!picked("languages")) {
    return problem("Please choose at least one language for your website.", languages);
  }
  for (const el of form.querySelectorAll("[data-short-msg]")) {
    if (el.value.trim().length < Number(el.getAttribute("minlength"))) {
      el.focus();
      return problem(el.dataset.shortMsg, el);
    }
  }
  error.hidden = true;

  const name = field("user_name");
  const email = field("user_email");
  const lines = [
    ["From", `${name} <${email}>`],
    ["WhatsApp", field("whatsapp")],
    ["Prefers contact by", picked("contact_pref")],
    ["", ""],
    ["Business", field("business_name")],
    ["What they do", field("business_about")],
    ["Customers in", picked("customers")],
    ["Current site / page", field("current_site")],
    ["", ""],
    ["Main goal", picked("goal")],
    ["Languages", picked("languages")],
    ["", ""],
    ["Website type", picked("site_type")],
    ["Pages", field("pages_list")],
    ["Products/services shown", picked("product_count")],
    ["Prices", picked("prices")],
    ["Features", picked("features")],
    ["Logo/photos/text ready", picked("content_ready")],
    ["Domain", picked("domain")],
    ["", ""],
    ["Sites they like", field("sites_liked")],
    ["Budget", field("budget")],
    ["Timeline", field("timeline")],
    ["Notes", field("notes")],
    ["", ""],
    ["Payment method", picked("payment_method")],
    ["Video consultation", picked("consultation")],
    ["Agreed to 50% deposit", picked("agree_deposit")],
  ];
  const message =
    "NEW PROJECT REQUEST (zenab.dev/start)\n\n" +
    lines
      .filter(([label, value]) => !label || value)
      .map(([label, value]) => (label ? `${label}: ${value}` : ""))
      .join("\n");

  button.disabled = true;
  button.textContent = "Sending...";
  emailjs
    .send(
      "service_qxdnyg4",
      "template_zkdk6zl",
      {
        user_name: name,
        from_name: name,
        name,
        user_email: email,
        reply_to: email,
        email,
        from_email: email,
        message,
      },
      "URaLON_8OTzDkIS1D"
    )
    .then(() => {
      form.hidden = true;
      document.querySelector(".brief__done").hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    })
    .catch(() => {
      button.disabled = false;
      button.textContent = "Send project details";
      alert(
        "The email service is temporarily unavailable. Please contact me directly at hello@zenab.dev"
      );
    });
}

// Swap the browser's "lengthen this text to N characters" warning for a friendlier one.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-short-msg]").forEach((el) => {
    el.addEventListener("invalid", () => {
      if (el.validity.tooShort) el.setCustomValidity(el.dataset.shortMsg);
    });
    el.addEventListener("input", () => el.setCustomValidity(""));
  });
  // Hide the project form's error message as soon as the client edits anything.
  const brief = document.getElementById("brief__form");
  if (brief) {
    brief.addEventListener("input", () => {
      brief.querySelector(".brief__error").hidden = true;
    });
  }
});

function toggleModal() {
  if (isModalOpen) {
    isModalOpen = false;
    return document.body.classList.remove("modal--open");
  }
  isModalOpen = true;
  document.body.classList += " modal--open";
}
