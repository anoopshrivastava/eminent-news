import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    id: "item-1",
    question: "What type of news do you provide?",
    answer:
      "We cover breaking news, politics, technology, entertainment, sports, and global current affairs. Our platform is updated every minute with verified information.",
  },
  {
    id: "item-2",
    question: "What are Shorts on this website?",
    answer:
      "Shorts are quick, snackable video clips under 60 seconds that summarize trending news stories in an engaging format.",
  },
  {
    id: "item-3",
    question: "Do you upload daily video news?",
    answer:
      "Yes. Our video team posts daily summaries, interviews, and explainers covering the most important events of the day.",
  },
  {
    id: "item-4",
    question: "How often is the news updated?",
    answer:
      "Our newsroom updates stories in real-time. You will always find the latest verified updates on our homepage.",
  },
  {
    id: "item-5",
    question: "How do I submit news or report an issue?",
    answer:
      "You can reach us through the contact page or email our editorial team with supporting details or evidence.",
  },
];

const FAQ: React.FC = () => {
  return (
    <div className="w-full mx-auto pt-16 md:pt-20 pb-4 md:pb-8">
      <h2 className="text-[20px] md:text-2xl font-bold mb-3 md:mb-6">Frequently Asked Questions</h2>

      <Accordion type="single" collapsible className="w-full">
        {faqData.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="flex items-center gap-3 text-left text-lg">
              <span>{item.question}</span>
            </AccordionTrigger>

            <AccordionContent className="text-gray-600 leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
