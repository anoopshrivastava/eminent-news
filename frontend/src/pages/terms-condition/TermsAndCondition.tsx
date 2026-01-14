import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Cookie,
  ShieldAlert,
  Link2,
  Layout,
} from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-sm text-muted-foreground">
            The Eminent News (TEN) — Empowering Wisdom
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>Welcome to The Eminent News (TEN) !!!</p>
            <p>
              These terms and conditions outline the rules and regulations
              for the use of The Eminent News's Website, located at
              contact@eminentnews.in. Please visit www.eminentnews.com /
              www.eminentnews.in.
            </p>
            <p>
              By accessing this website we assume you accept these terms
              and conditions. Do not continue to use The Eminent News if
              you do not agree to take all of the terms and conditions
              stated on this page.
            </p>
          </CardContent>
        </Card>

        {/* Terminology */}
        <Card>
          <CardHeader>
            <CardTitle>Terminology</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              The following terminology applies to these Terms and
              Conditions, Privacy Statement and Disclaimer Notice and all
              Agreements: "Client", "You" and "Your" refers to you, the
              person log on this website and compliant to the Company’s
              terms and conditions.
            </p>
            <p>
              "The Company", "Ourselves", "We", "Our" and "Us", refers to
              our Company. "Party", "Parties", or "Us", refers to both the
              Client and ourselves.
            </p>
            <p>
              All terms refer to the offer, acceptance, and consideration
              of payment necessary to undertake the process of our
              assistance to the Client in the most appropriate manner in
              accordance with prevailing law of Netherlands.
            </p>
            <p>
              Any use of the above terminology or other words in the
              singular, plural, capitalization and/or he/she or they, are
              taken as interchangeable and therefore as referring to the same.
            </p>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Cookie className="h-5 w-5 text-orange-600" />
            <CardTitle>Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              We employ the use of cookies. By accessing The Eminent News
              (TEN), you agreed to use cookies in agreement with The
              Eminent News's Privacy Policy.
            </p>
            <p>
              Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
            </p>
          </CardContent>
        </Card>

        {/* License */}
        <Card>
          <CardHeader>
            <CardTitle>License</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              Unless otherwise stated, The Eminent News (TEN) and/or its licensors own the intellectual property rights for all material on The Eminent News (TEN) . All intellectual property rights are reserved. You may access this from The Eminent News for your own personal use subject to restrictions set in these terms and conditions.
            </p>
            <p>You must not:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Republish material from The Eminent News (TEN)</li>
              <li>Sell, rent or sub-license material from The Eminent News (TEN)</li>
              <li>Reproduce, duplicate or copy material from The Eminent News (TEN)</li>
              <li>Redistribute content from The Eminent News (TEN)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>This Agreement shall begin on the date hereof.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              1. Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website.The Eminent News does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of The Eminent News, its agents, and/or affiliates.
            </p>
            <p>
              2. Comments reflect the views and opinions of the person who posts their views and opinions. To the extent permitted by applicable laws, The Eminent News shall not be liable for the Comments or for any liability, damages, or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
            </p>
            <p>
              3. The Eminent News reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.
            </p>

            <div>You warrant and represent that:</div>
            <p>1. You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</p>
            <p>2. The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</p>
            <p>3. The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy</p>
            <p>4. The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</p>
            <div>
                You hereby grant The Eminent News a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats, or media
            </div>
          </CardContent>
        </Card>

        {/* Hyperlinking */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Link2 className="h-5 w-5 text-blue-600" />
            <CardTitle>Hyperlinking to our Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <div>The following organizations may link to our Website without prior written approval:</div>
            <ul className="list-disc pl-6 space-y-1">
                <li>Government agencies;</li>
                <li>search engines;</li>
                <li>search engines;</li>
                <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
                <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls and charity fundraising groups which may not hyperlink to our Web site.</li>
            </ul>
            <p>These organizations may link to our home page, to publications or to other Website information so long as the link: </p>
            <ul className="list-disc pl-6 space-y-1">
                <li>is not in any way deceptive;</li>
                <li>does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and</li>
                <li>fits within the context of the linking party’s site.</li>
            </ul>

            <p>We may consider and approve other link requests from the following types of organizations:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li>1.	commonly-known consumer and/or business information sources;</li>
                <li>2.	dot.com community sites;</li>
                <li>3.	associations or other groups representing charities;</li>
                <li>4.	online directory distributors;</li>
                <li>5.	internet portals</li>
                <li>6.	accounting, law and consulting firms; and</li>
                <li>7.	educational institutions and trade associations.</li>
            </ul>

            <p>We will approve link requests from these organizations if we decide that:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li>the link would not make us look unfavorably to ourselves or to our accredited businesses;</li>
                <li>the organization does not have any negative records with us;</li>
                <li>the benefit to us from the visibility of the hyperlink compensates the absence of The Eminent News, and </li>
                <li>the link is in the context of general resource information.</li>
                
            </ul>

            <p>These organizations may link to our home page so long as the link:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li>is not in any way deceptive; </li>
                <li>does not falsely imply sponsorship, endorsement, or approval of the linking party and its products or services; and</li>
                <li>fits within the context of the linking party’s site.</li>
            </ul>

            <p>If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to The Eminent News. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.</p>
     
            <p>Approved organizations may hyperlink to our Website as follows:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li>By use of our corporate name; or</li>
                <li>By use of the uniform resource locator being linked to; or</li>
                <li>By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party’s site.</li>
                <li>No use of The Eminent News's logo or other artwork will be allowed for linking absent a trademark license agreement</li>
            </ul>

          </CardContent>
        </Card>

        {/* iFrames */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Layout className="h-5 w-5 text-purple-600" />
            <CardTitle>iFrames</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            <p>
              Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.
            </p>
          </CardContent>
        </Card>

        {/* Liability */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <CardTitle>Content Liability & Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene, or criminal, or which infringes, otherwise violates or advocates the infringement or other violation of, any third party rights
            </p>
          </CardContent>
        </Card>

        {/* Reservation of Rights */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <CardTitle> Reservation of Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request.
            </p>
            <p>We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.</p>
          </CardContent>
        </Card>

        {/* Removal of links from our website */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <CardTitle>Removal of links from our website</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
            </p>
            <p>We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.</p>
          </CardContent>
        </Card>

        {/* Disclaimer*/}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <CardTitle>Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
            </p>
            <ul className="list-disc pl-6 space-y-1">
                <li>limit or exclude our or your liability for death or personal injury;</li>
                <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or.</li>
                <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
            </ul>
            <p>The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: </p>
            <ul className="list-disc pl-6 space-y-1">
                <li>are subject to the preceding paragraph; and</li>
                <li>govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.</li>
            </ul>
            <p>As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</p>
            <p className="text-center font-semibold">We are deeply aligned with our Tagline that is "Empowering Wisdom" so please join us to Learn ,Leap & Lead in Life with mutual trust and wisdom ..</p>
            
          </CardContent>
        </Card>




        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Thank you,</p>
          <p className="font-medium">Anoop Shrivastava</p>
          <p>Founder, The Eminent News (TEN)</p>
          {/* <p>
            <a href="mailto:founder@TEN" className="text-primary underline">
              founder@TEN
            </a>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
