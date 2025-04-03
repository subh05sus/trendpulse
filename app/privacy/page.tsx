/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy | TrendPulse",
  description: "How we handle your data and protect your privacy",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: 3/4/2025</p>
      </div>

      <Separator className="my-6" />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
          <CardDescription>Our commitment to your privacy</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            At TrendPulse, we respect your privacy and are committed to
            protecting your personal data. This privacy policy will inform you
            about how we look after your personal data when you visit our
            website and tell you about your privacy rights and how the law
            protects you.
          </p>
          <p>
            Please read this privacy policy carefully before using our Services.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
          <CardDescription>
            Types of data we gather when you use our platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Personal Information</h3>
            <p>
              When you create an account, we may collect your name, email
              address, and profile information.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Usage Data</h3>
            <p>
              We collect information about how you interact with our website,
              including pages visited, time spent, and features used.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Cookies and Tracking</h3>
            <p>
              We use cookies and similar tracking technologies to track activity
              on our website and hold certain information to improve your
              experience.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process your transactions</li>
            <li>Send you notifications related to your account</li>
            <li>
              Respond to your comments, questions, and customer service requests
            </li>
            <li>Monitor and analyze usage patterns and trends</li>
            <li>
              Protect against, identify, and prevent fraud and other harmful
              activity
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Security</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We implement appropriate security measures to protect your personal
            information. However, no electronic transmission or storage of
            information can be entirely secure, and we cannot guarantee absolute
            security of your data.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Our website may contain links to third-party websites or services.
            We are not responsible for the privacy practices or content of these
            third-party sites. We encourage you to read the privacy policies of
            every website you visit.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Data Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Depending on your location, you may have certain rights regarding
            your personal information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The right to access your personal data</li>
            <li>The right to correct inaccurate personal data</li>
            <li>The right to request the deletion of your personal data</li>
            <li>
              The right to restrict or object to the processing of your personal
              data
            </li>
            <li>The right to data portability</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Changes to This Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We may update our privacy policy from time to time. We will notify
            you of any changes by posting the new privacy policy on this page
            and updating the "Last updated" date at the top of this policy.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            If you have any questions or concerns about our privacy policy,
            please contact us:
          </p>
          <p>
            <strong>Email:</strong> sahasubhadip54@gmail.com
          </p>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <Link href="/" className="text-primary hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
