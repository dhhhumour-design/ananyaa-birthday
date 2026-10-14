import React, { useState, useEffect } from 'react';
import { Mail, Heart, Sparkles, Feather } from 'lucide-react';
import { sound } from '../utils/audio';

const FULL_LETTER_TEXT = `Happy Birthday to the sweetest part of my life! 🎂❤️🫶🏻

Hhaaaa! ❤️ Ye actually handwritten hone wala tha par kuch reasons ki waja se nahi ho paya Aur hai maine aaj se pehle kisi ko aise gift nahi diya hai to mujhe honestly koi idea nahi hai ki ye sab kaise likhte hain Agar kuch galat ho jaaye toh maaf kar dena okay? Hahaaa! 🫠💗 Chalo start karte hain...

Haaa! To 😮‍💨 tumhe to pata hi hai ki tum meri 2nd priority ho aur main tum par kitna trust karta hu Par kuch bate aisi hoti hai jo mein tum se bol nhi paya kabhi to isliye socha aaj likh hi deta hu...

Pata hai jab Sneh se meri ladai hui thi to uske bad Maine tumhe samjhane ki koshish bhi ki thi. par Us din jis tarah se tumne mujhse baat ki thi mujhe genuinely bahut bura laga tha  us moment par mereko bhut hurt hua tha kyunki maine kabhi expect nahi kiya tha ki aisa kuch ho sakta hai..Us din mujhe realise hua ki jab ham kisi ko apna maante hain to usse judi chhoti chhoti bate bhi hame kitna hurt kar sakti hai . Aur ha main tumhe ye sab isliye nahi bata raha hu ki tumhe bura lage ya tum khud ko blame karo. Tumhari jagah meri life mein aaj bhi wahi hai jo pehle thi samajhe cutie pie 🥰Aur pata hai tumhari ek baat mujhe genuinely bahut achhi lagti hai ki jab se ham dost bane hai tab se lekar aaj tak humare beech kitni hi ladai hui hai kitni misunderstandings hui hai kitni baar things complicated hui hain... par tumne aaj tak mujhe ye nahi kaha ki "tu mujhse baat mat kar"
Aur sorry na jo bhi hua aur mujhe tum se bhot sari baat karni hai online kyuki offline to aur bhi log sunte hai isiliye online baat karni hai agar kar pao to agar nhi karna baat to koi baat nhi it's your choice mein tumhe kabhi bhi force nhi Karna chata na hi hurt. mein to bass tumhe khosh dekhna chata huu ab chaiye mere sath ya fir kisi aur ke sath vo matter nhi Karta par kabhi bhi kisi bhi chiz ki tension mat Lena mein hamesha tumhare sath huu tum mujhe Bata Sakti ho no matter ki kis chiz se related hai mein hamesha tumhare support mein huu ab chaiye tum opposite side mein hi kyu na ho ...And lastly I'm sorry for everything that happened between us Agar meri kisi baat se tumhe hurt hua ho to genuinely sorry.
Once again HAPPY BIRTHDAY CUTIE PIEEEE! 🥳🎂💗`;

interface BirthdayLetterProps {
  onBurstConfetti: (x?: number, y?: number) => void;
}

export const BirthdayLetter: React.FC<BirthdayLetterProps> = ({ onBurstConfetti }) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSealed, setIsSealed] = useState(true);

  const startRevealing = (e?: React.MouseEvent) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      onBurstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    sound.playSparkle();
    setIsSealed(false);
    setHasStarted(true);
    setIsTyping(true);
  };

  const skipToEnd = () => {
    sound.playSparkle();
    setDisplayedLength(FULL_LETTER_TEXT.length);
    setIsTyping(false);
  };

  useEffect(() => {
    if (!isTyping || displayedLength >= FULL_LETTER_TEXT.length) {
      if (displayedLength >= FULL_LETTER_TEXT.length) {
        setIsTyping(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      // Natural typewriter pace for longer emotional letter
      const step = Math.min(5, FULL_LETTER_TEXT.length - displayedLength);
      setDisplayedLength((prev) => prev + step);
    }, 20);

    return () => clearTimeout(timer);
  }, [isTyping, displayedLength]);

  return (
    <section className="py-14 px-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-pill mb-2">
          <Mail className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-xs font-semibold text-rose-900 tracking-wide uppercase">
            Personal Note
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950">
          A Little Letter For You
        </h2>
        <p className="text-sm text-rose-900/70">
          Words straight from the heart, just for Ananya.
        </p>
      </div>

      {/* Parchment Glass Card */}
      <div className="relative rounded-3xl p-7 sm:p-9 liquid-glass shadow-xl shadow-rose-950/10 border border-white/90 overflow-hidden">
        {/* Soft Decorative Watermark & Stamp */}
        <div className="absolute top-4 right-5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/60 border border-rose-200/50 text-[11px] font-semibold text-rose-800">
          <Feather className="w-3 h-3 text-rose-500" />
          <span>Handwritten</span>
        </div>

        {isSealed ? (
          /* Sealed State: Wax Seal Prompt */
          <div className="py-12 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/30 glow-rose animate-pulse">
                <Heart className="w-9 h-9 text-white fill-white" />
              </div>
              <Sparkles className="absolute -bottom-1 -right-1 w-5 h-5 text-amber-400 fill-amber-300 animate-bounce" />
            </div>

            <h3 className="font-serif text-xl font-bold text-rose-950 mb-2">
              Sealed with Affection
            </h3>
            <p className="text-xs sm:text-sm text-rose-900/75 max-w-xs mb-6">
              Tap the wax seal below to unfold your personalized birthday letter.
            </p>

            <button
              onClick={startRevealing}
              className="liquid-pill px-6 py-3 rounded-full font-semibold text-rose-900 text-sm hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Break Seal & Read</span>
            </button>
          </div>
        ) : (
          /* Unfolded Letter Content */
          <div>
            <div className="font-['Caveat',_cursive] text-xl sm:text-2xl text-rose-950 leading-relaxed sm:leading-loose whitespace-pre-wrap select-text">
              {FULL_LETTER_TEXT.slice(0, displayedLength)}
              {isTyping && (
                <span className="inline-block w-1.5 h-5 bg-rose-500 ml-1 animate-pulse align-middle" />
              )}
            </div>

            {/* Quick Skip Button if typing */}
            {isTyping && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={skipToEnd}
                  className="text-xs text-rose-700/70 hover:text-rose-900 font-medium underline cursor-pointer"
                >
                  Read all at once →
                </button>
              </div>
            )}

            {!isTyping && hasStarted && (
              <div className="mt-8 pt-5 border-t border-rose-200/50 flex items-center justify-between text-xs text-rose-800/70 font-sans">
                <span className="inline-flex items-center gap-1">
                  <span>With affection</span>
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                </span>
                <span className="font-semibold text-rose-900">15 October</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
