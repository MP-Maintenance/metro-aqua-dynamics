import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFAQs } from "../hooks/useFAQs";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQSection = () => {
  const { faqs, loading } = useFAQs(true);
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 3);
  const remainingCount = faqs.length - 3;

  return (
    <section className="py-24 px-4 bg-muted/50">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
        <p className="text-center text-muted-foreground mb-12">
          Find answers to common questions about our services
        </p>
        
        <Accordion type="single" collapsible className="space-y-4">
          {visibleFaqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-background border rounded-lg px-6 shadow-sm"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {faqs.length > 3 && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="gap-2"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show {remainingCount} More FAQ{remainingCount > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
