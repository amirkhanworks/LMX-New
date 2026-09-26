const WA = "https://wa.me/919619310901?text=" + encodeURIComponent("Hi, please add me to the Luminox app waitlist.");

export function initWaitlist() {
  const form = document.querySelector("[data-waitlist]");
  if (!form) return;
  const status = form.querySelector("[data-waitlist-status]");
  const input = form.querySelector("input[type=\"email\"]");
  const btn = form.querySelector("button[type=\"submit\"]");
  const configured = /formspree\.io\/f\/(?!FORMSPREE_FORM_ID)[\w-]+$/.test(form.action);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!configured) {
      form.dataset.state = "error";
      status.innerHTML = `Sign-ups open soon. For now, <a href="${WA}" target="_blank" rel="noopener">message us on WhatsApp</a> and we will add you to the list.`;
      return;
    }
    if (!input.checkValidity()) {
      form.dataset.state = "error";
      input.setAttribute("aria-invalid", "true");
      status.textContent = "Please enter a valid email address.";
      input.focus();
      return;
    }
    input.removeAttribute("aria-invalid");
    btn.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.textContent = "Sending...";
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      form.dataset.state = "success";
      status.textContent = "You are on the list.";
    } catch {
      form.dataset.state = "error";
      status.innerHTML = `Something went wrong. <a href="${WA}" target="_blank" rel="noopener">Message us on WhatsApp</a> instead.`;
    } finally {
      btn.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
}
