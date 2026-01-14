import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, RefreshCcw } from "lucide-react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Disclaimer</h1>
          <p className="text-sm text-muted-foreground">
            The Eminent News (TEN) — Empowering Wisdom
          </p>
        </div>

        {/* Intro */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              Dear Visitor, if you require any more information or have any
              questions about our site’s disclaimer, please feel free to contact
              us at{" "}
              <a
                href="mailto:contact@eminentnews.in"
                className="text-primary underline"
              >
                contact@eminentnews.in
              </a>.
            </p>
            <p>
              , Feel free to visit www.eminentnews.com / www.eminentnews.in for best Current affairs News only at TEN..
            </p>
          </CardContent>
        </Card>

        {/* Disclaimers for The Eminent News (TEN) */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <CardTitle>Disclaimers for The Eminent News (TEN)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              All the information on this website www.eminentnews.in is published in good faith and for general information purpose only. The Eminent News does not make any warranties about the completeness, reliability and accuracy of this information.
            </p>
            <p>
              Any action you take upon the information you find on this website (The Eminent News), is strictly at your own risk. The Eminent News will not be liable for any losses and/or damages in connection with the use of our website.
            </p>
            <p>From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. </p>
            <p>These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link that may have gone ‘bad </p>
            <p>Please be also aware that when you leave our website, other sites may have different privacy policies and terms that are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their “Terms of Service” before engaging in any business or uploading any information. Our Privacy Policies may differ from others. visit here</p>
          </CardContent>
        </Card>

        {/* Consent */}
        <Card>
          <CardHeader>
            <CardTitle>Consent</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed font-semibold">
            <p>
             By using our website, you hereby consent to our disclaimer and agree to its terms.
            </p>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <RefreshCcw className="h-5 w-5 text-purple-600" />
            <CardTitle>Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              Should we update, amend, or make any changes to this document,
              those changes will be prominently posted on this page.
            </p>
            <p>
              Follow us on Instagram, YouTube, X (Twitter), LinkedIn, and
              Telegram for daily updates.
            </p>
            <p className="font-medium">
              We are deeply aligned with our tagline:{" "}
              <span className="italic">“Empowering Wisdom”</span>.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Thank you,</p>
          <p className="font-medium">Anoop Shrivastava</p>
          <p>Founder, The Eminent News (TEN)</p>
          {/* <p>
            <a
              href="mailto:founder@TEN"
              className="text-primary underline"
            >
              founder@TEN
            </a>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
