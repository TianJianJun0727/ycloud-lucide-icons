import { ref } from 'vue';

export default function useConfetti(initialText = '') {
  const animate = ref(false);
  const confettiText = ref(initialText);

  function confetti() {
    animate.value = true;

    setTimeout(function () {
      animate.value = false;
    }, 1000);
  }

  return {
    animate,
    confetti,
    confettiText,
  };
}
