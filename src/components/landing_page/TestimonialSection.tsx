import { useEffect, useRef } from "react";
import gsap from "gsap";

// Import images
import onions from "../Images/onions.svg";
import lettuce from "../Images/leaves.svg";
import say from "../Images/chef-holding-vegetables-1.svg";
import chicken from "../Images/meat.svg";
import testifier from "../Images/Testifier.svg";

interface GSAPAnimation {
  filter: string;
  opacity?: number;
  x?: number;
  y?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  repeat?: number;
  yoyo?: boolean;
}

export default function TestimonialSection() {
  const chefRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<Array<HTMLImageElement | null>>([]);

  const setIngredientRef = (index: number) => (el: HTMLImageElement | null) => {
    ingredientsRef.current[index] = el;
  };

  useEffect(() => {
    if (!chefRef.current || !textRef.current) return;

    // Animate chef image blur removal
    gsap.fromTo(
      chefRef.current,
      { 
        filter: "blur(10px)", 
        opacity: 0 
      } as GSAPAnimation,
      { 
        filter: "blur(0px)", 
        opacity: 1, 
        duration: 1.5, 
        ease: "power3.out" 
      } as GSAPAnimation
    );

    // Animate text section fade-in
    gsap.from(textRef.current, {
      opacity: 1,
      x: 50,
      duration: 1,
      delay: 0.5,
      ease: "power3.out",
    } as GSAPAnimation);

    // Floating animations for ingredients
    ingredientsRef.current.forEach((ingredient, index) => {
      if (ingredient) {
        gsap.to(ingredient, {
          y: index % 2 === 0 ? -15 : 15,
          repeat: -1,
          yoyo: true,
          duration: 2 + index * 0.5,
          ease: "sine.inOut",
        } as GSAPAnimation);
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16 px-6 md:px-16">
      {/* Left - Image Section */}
      <div className="relative w-[350px] h-[420px] flex items-center justify-center mx-auto">
        {/* Foreground Image (Chef) with Blur Animation */}
        <img
          ref={chefRef}
          src={say}
          alt="Chef"
          className="relative w-full h-auto object-cover drop-shadow-xl transition-all duration-300 hover:blur-sm"
        />

        {/* Floating Ingredients */}
        <img
          ref={setIngredientRef(0)}
          src={onions}
          alt="Onions"
          className="absolute top-2 left-4 w-10 hover:scale-110 transition-transform duration-300"
        />
        <img
          ref={setIngredientRef(1)}
          src={lettuce}
          alt="Lettuce"
          className="absolute top-10 right-6 w-14 hover:rotate-12 transition-transform duration-300"
        />
        <img
          ref={setIngredientRef(2)}
          src={chicken}
          alt="Chicken"
          className="absolute bottom-8 left-10 w-12 hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Right - Testimonial Section */}
      <div ref={textRef}>
        <p className="text-left text-2xl text-[#a82f17] font-medium">What they say</p>
        <h1 className="text-left text-4xl font-bold font-fredoka mt-2 leading-snug">
          What our customers <br />
          Say about us
        </h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          "ByteEat is the best. Besides the many and delicious meals, the
          service is also very good, especially in the very fast delivery. 
          I highly recommend ByteEat to you."
        </p>
        
        {/* Reviewer */}
        <div className="flex items-center mt-6 gap-4">
          <img 
            src={testifier} 
            alt="Testifier" 
            className="w-14 h-14 rounded-full border-4 border-red-500 shadow-md"
          />
          <div>
            <p className="text-lg font-semibold">Theresa Jordan</p>
            <p className="text-gray-500 text-sm">Food Enthusiast</p>
          </div>
        </div>
      </div>
    </div>
  );
}