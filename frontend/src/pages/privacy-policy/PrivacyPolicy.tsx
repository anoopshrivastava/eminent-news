import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  MessageSquare,
  Image as ImageIcon,
  Cookie,
  Globe,
  Users,
  Database,
  MapPin,
} from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            The Eminent News (TEN)
          </p>
        </div>

        {/* Who we are */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Who we are</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              We at the The Eminent News (TEN) and its subsidiaries,
              (“the Company/The Eminent News /We/Us/The Eminent News ”)
              are committed to protecting the privacy and security of your
              personal information. Your privacy is important to us and
              maintaining your trust is paramount.
            </p>

            <p>
              Our website address is: www.eminentnews.in /
              www.eminentnews.com
            </p>

            <p>
              you can visit our Social media plateform here , Follow us on
              Instagram, YouTube, X. telegram and Linkedin , Arattai for
              daily updates on verified current affairs News .
            </p>

            <p>
              We are deeply aligned with our Tagline that is "Empowering
              Wisdom" , so join us with vision to learn, leap and lead in
              life altogther ..
            </p>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              When visitors leave comments on the site we collect the data
              shown in the comments form, and also the visitor’s IP
              address and browser user agent string to help spam
              detection.
            </p>

            <p>
              An anonymized string created from your email address (also
              called a hash) may be provided to the Gravatar service to
              see if you are using it. After approval of your comment,
              your profile picture is visible to the public in the
              context of your comment. visit here
            </p>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-600" />
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            <p>
              If you upload images to the website, you should avoid
              uploading images with embedded location data (EXIF GPS)
              included. Visitors to the website can download and extract
              any location data from images on the website.
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
              If you leave a comment on our site you may opt-in to saving
              your name, email address and website in cookies. These are
              for your convenience so that you do not have to fill in
              your details again when you leave another comment. These
              cookies will last for one year.
            </p>

            <p>
              If you visit our login page, we will set a temporary cookie
              to determine if your browser accepts cookies. This cookie
              contains no personal data and is discarded when you close
              your browser.
            </p>

            <p>
              When you log in, we will also set up several cookies to save
              your login information and your screen display choices.
              Login cookies last for two days, and screen options cookies
              last for a year. If you select “Remember Me”, your login
              will persist for two weeks. If you log out of your account,
              the login cookies will be removed.
            </p>

            <p>
              If you edit or publish an article, an additional cookie
              will be saved in your browser. This cookie includes no
              personal data and simply indicates the post ID of the
              article you just edited. It expires after 1 day.
            </p>
          </CardContent>
        </Card>

        {/* Embedded content */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Globe className="h-5 w-5 text-cyan-600" />
            <CardTitle>Embedded content from other websites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              Articles on this site may include embedded content (e.g.
              videos, images, articles, etc.). Embedded content from
              other websites behaves in the exact same way as if the
              visitor has visited the other website.
            </p>

            <p>
              These websites may collect data about you, use cookies,
              embed additional third-party tracking, and monitor your
              interaction with that embedded content, including tracking
              your interaction with the embedded content if you have an
              account and are logged in to that website.
            </p>
          </CardContent>
        </Card>

        {/* Data sharing */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            <CardTitle>Who we share your data with</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            <p>
              If you request a password reset, your IP address will be
              included in the reset email.
            </p>
          </CardContent>
        </Card>

        {/* Retention */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Database className="h-5 w-5 text-red-600" />
            <CardTitle>How long we retain your data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              If you leave a comment, the comment and its metadata are
              retained indefinitely. This is so we can recognize and
              approve any follow-up comments automatically instead of
              holding them in a moderation queue.
            </p>

            <p>
              For users that register on our website (if any), we also
              store the personal information they provide in their user
              profile. All users can see, edit, or delete their personal
              information at any time (except they cannot change their
              username). Website administrators can also see and edit
              that information.
            </p>
          </CardContent>
        </Card>

        {/* Rights */}
        <Card>
          <CardHeader>
            <CardTitle>What rights you have over your data</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            <p>
              If you have an account on this site, or have left comments,
              you can request to receive an exported file of the personal
              data we hold about you, including any data you have
              provided to us. You can also request that we erase any
              personal data we hold about you. This does not include any
              data we are obliged to keep for administrative, legal or
              security purposes.
            </p>
          </CardContent>
        </Card>

        {/* Data destination */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-600" />
            <CardTitle>Where your data is sent</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            <p>
              Visitor comments may be checked through an automated spam
              detection service.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Thank you</p>
          <p className="font-medium">Anoop Shrivastava</p>
          <p>founder@TEN</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
