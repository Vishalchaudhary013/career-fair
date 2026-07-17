import { useState } from "react";

import { ChevronDown } from "lucide-react";


const ThingsToKnow = ({ instructions, termsText, faqs = [] }) => {
  const [openSection, setOpenSection] = useState(-1);
  const [openIndex, setOpenIndex] = useState(-1);

  const sections = [];
  if (instructions) sections.push({ title: "Instructions", content: [instructions] });
  if (termsText) sections.push({ title: "Terms & Conditions", content: [termsText] });

const toggleAccordion = (index) => {
  setOpenIndex(openIndex === index ? -1 : index);
};

  if (sections.length === 0 && (!faqs || faqs.length === 0)) {
    return null;
  }

  return (
    <div className="">
      {sections.length > 0 && (
        <>
          <h2 className="text-xl text-primary font-semibold p-5 -ml-5">More</h2>

          <div className="columns-1 md:columns-2 gap-4 mb-6">
            {sections.map((section, index) => {
              const isOpen = openSection === index;

              return (
                <div key={section.title} className="border bg-white border-black/10 rounded-lg overflow-hidden ">
                  <button
                    type="button"
                    onClick={() => setOpenSection(isOpen ? -1 : index)}
                    className="w-full flex  justify-between gap-4 px-4 py-4 text-left h-16"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium ">{section.title}</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-sm text-black/75 space-y-2">
                      {section.content.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {faqs && faqs.length > 0 && (
        <section className="rounded-xl mt-5 ">
          <div className="">
            
              <h2 className="text-xl text-primary text-center font-semibold pt-5 mb-6 ">
                Frequently Asked Questions
              </h2>
            
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-black/10 rounded-lg overflow-hidden bg-white"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium">
                    {faq.q || faq.question}
                  </span>

                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="p-4 border-t border-black/5 bg-white">
                    <p className="text-gray-600">{faq.a || faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ThingsToKnow;



