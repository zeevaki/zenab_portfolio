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
        "The email service is temporarily unavailable. Please contact me directly on zeevaki@gmail.com"
      );
    });
}


function toggleModal() {
  if (isModalOpen) {
    isModalOpen = false;
    return document.body.classList.remove("modal--open");
  }
  isModalOpen = true;
  document.body.classList += " modal--open";
}
