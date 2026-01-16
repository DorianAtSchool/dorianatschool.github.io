(() => {
    const rejectionLetters = [
        "Thank you for your interest. After careful consideration, we are moving forward with other candidates whose experience more closely matches our needs. We appreciate your time and wish you the best.",
        "We enjoyed learning about your work. At this time, we have decided to proceed with another applicant. Thank you again for your interest and all the best in your search.",
        "Thank you for applying. While your background is impressive, we will not be moving forward at this time. We hope our paths cross again in the future.",
        "We appreciate the opportunity to review your profile. We have chosen to move ahead with other candidates. Thank you again for your interest."
    ];

    const confettiColors = ["#1a1a1a", "#d4c4a8", "#e8dcc8", "#f5f0e8", "#666666"];

    const getRandom = (min, max) => Math.random() * (max - min) + min;

    const moveRunawayButton = (button, container) => {
        if (!button || !container) {
            return;
        }

        if (!button.dataset.runawayPlaceholder) {
            const placeholder = button.cloneNode(true);
            placeholder.classList.add("hiring-placeholder");
            placeholder.removeAttribute("data-hiring-no-final");
            placeholder.setAttribute("aria-hidden", "true");
            placeholder.tabIndex = -1;
            placeholder.disabled = true;
            button.parentNode.insertBefore(placeholder, button);
            button.dataset.runawayPlaceholder = "true";
        }

        button.style.position = "absolute";
        button.style.right = "auto";
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const maxLeft = Math.max(8, containerRect.width - buttonRect.width - 8);
        const maxTop = Math.max(8, containerRect.height - buttonRect.height - 8);
        const left = Math.floor(getRandom(8, maxLeft));
        const top = Math.floor(getRandom(8, maxTop));

        button.style.left = `${left}px`;
        button.style.top = `${top}px`;
    };

    const launchConfetti = () => {
        const existing = document.querySelector(".confetti");
        if (existing) {
            existing.remove();
        }

        const confetti = document.createElement("div");
        confetti.className = "confetti";

        for (let i = 0; i < 80; i += 1) {
            const piece = document.createElement("span");
            piece.className = "confetti-piece";
            piece.style.left = `${getRandom(0, 100)}%`;
            piece.style.width = `${getRandom(6, 12)}px`;
            piece.style.height = `${getRandom(10, 18)}px`;
            piece.style.animationDuration = `${getRandom(2, 3.6)}s`;
            piece.style.animationDelay = `${getRandom(0, 0.6)}s`;
            piece.style.backgroundColor = confettiColors[i % confettiColors.length];
            piece.style.setProperty("--spin", `${getRandom(0, 360)}deg`);
            confetti.appendChild(piece);
        }

        document.body.appendChild(confetti);

        window.setTimeout(() => {
            confetti.remove();
        }, 4200);
    };

    const setupHiringModal = () => {
        const openTrigger = document.querySelector("[data-hiring-open]");
        const modal = document.querySelector("[data-hiring-modal]");

        if (!openTrigger || !modal) {
            return;
        }

        const closeTriggers = modal.querySelectorAll("[data-hiring-close]");
        const question = modal.querySelector("[data-hiring-question]");
        const initialActions = modal.querySelector("[data-hiring-initial]");
        const finalActions = modal.querySelector("[data-hiring-final]");
        const response = modal.querySelector("[data-hiring-response]");
        const contact = modal.querySelector("[data-hiring-contact]");
        const yesInitial = modal.querySelector("[data-hiring-yes-initial]");
        const noInitial = modal.querySelector("[data-hiring-no-initial]");
        const yesFinal = modal.querySelector("[data-hiring-yes-final]");
        const noFinal = modal.querySelector("[data-hiring-no-final]");
        const runawayArea = modal.querySelector("[data-hiring-runaway-area]");

        const resetModal = () => {
            if (question) {
                question.textContent = "Are you building things to help humans or animals?";
            }
            if (response) {
                response.textContent = "";
                response.classList.add("is-hidden");
            }
            if (contact) {
                contact.classList.add("is-hidden");
            }
            if (initialActions) {
                initialActions.classList.remove("is-hidden");
            }
            if (finalActions) {
                finalActions.classList.add("is-hidden");
            }
            if (noFinal) {
                noFinal.style.left = "";
                noFinal.style.top = "";
                noFinal.style.right = "";
                noFinal.style.bottom = "";
                noFinal.style.position = "relative";
                delete noFinal.dataset.runawayPlaceholder;
            }
            const placeholders = modal.querySelectorAll(".hiring-placeholder");
            placeholders.forEach((placeholder) => placeholder.remove());
        };

        const openModal = () => {
            resetModal();
            modal.classList.remove("is-hidden");
            modal.setAttribute("aria-hidden", "false");
        };

        const closeModal = () => {
            modal.classList.add("is-hidden");
            modal.setAttribute("aria-hidden", "true");
        };

        openTrigger.addEventListener("click", openModal);
        closeTriggers.forEach((button) => {
            button.addEventListener("click", closeModal);
        });

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        if (yesInitial) {
            yesInitial.addEventListener("click", () => {
                if (question) {
                    question.textContent = "Hire me??";
                }
                if (initialActions) {
                    initialActions.classList.add("is-hidden");
                }
                if (finalActions) {
                    finalActions.classList.remove("is-hidden");
                }
                if (response) {
                    response.classList.add("is-hidden");
                }
                if (contact) {
                    contact.classList.add("is-hidden");
                }
            });
        }

        if (noInitial) {
            noInitial.addEventListener("click", () => {
                if (question) {
                    question.textContent = "Thanks for your time.";
                }
                if (response) {
                    const letter = rejectionLetters[Math.floor(Math.random() * rejectionLetters.length)];
                    response.textContent = letter;
                    response.classList.remove("is-hidden");
                }
                if (initialActions) {
                    initialActions.classList.add("is-hidden");
                }
                if (finalActions) {
                    finalActions.classList.add("is-hidden");
                }
                if (contact) {
                    contact.classList.add("is-hidden");
                }
            });
        }

        if (yesFinal) {
            yesFinal.addEventListener("click", () => {
                if (finalActions) {
                    finalActions.classList.add("is-hidden");
                }
                if (contact) {
                    contact.classList.remove("is-hidden");
                }
                launchConfetti();
            });
        }

        if (noFinal) {
            const move = () => moveRunawayButton(noFinal, runawayArea || finalActions);
            noFinal.addEventListener("mouseenter", move);
            noFinal.addEventListener("focus", move);
            noFinal.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                move();
            });
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupHiringModal);
    } else {
        setupHiringModal();
    }
})();
