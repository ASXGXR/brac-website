// Changing Language

const changeLangSpeed = 400;
document.getElementById('lang-toggle').addEventListener('change', function() {
  const isThai = this.checked;

  document.querySelectorAll('.thai-txt').forEach(e => {
    const englishTexts = document.querySelectorAll('.english-txt');

    // Hide English text with animation
    englishTexts.forEach(en => {
      en.style.transform = 'translateY(-20px)';
      en.style.opacity = 0;
      setTimeout(() => {
        en.style.display = 'none';
      }, changeLangSpeed);
    });

    if (isThai) {
      // Show Thai text with animation
      setTimeout(() => {
        e.style.display = 'block';
        e.style.transform = 'translateY(20px)';
        e.style.opacity = 0;
        setTimeout(() => {
          e.style.transform = 'translateY(0)';
          e.style.opacity = 1;
        }, 50);
      }, changeLangSpeed);
    } else {
      // Hide Thai text and show English text
      e.style.transform = 'translateY(-20px)';
      e.style.opacity = 0;
      setTimeout(() => {
        e.style.display = 'none';
      }, changeLangSpeed);

      englishTexts.forEach(en => {
        setTimeout(() => {
          en.style.display = 'block';
          en.style.transform = 'translateY(20px)';
          en.style.opacity = 0;
          setTimeout(() => {
            en.style.transform = 'translateY(0)';
            en.style.opacity = 1;
          }, 50);
        }, changeLangSpeed);
      });
    }
  });
});