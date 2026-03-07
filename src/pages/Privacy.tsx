import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="font-display text-4xl md:text-5xl font-800 text-foreground mb-2">
          Roamie Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-10">
          <strong>Last Updated:</strong> 03/06/2026
        </p>

        <div className="prose prose-neutral max-w-none space-y-8 text-foreground/90">
          <p>
            This Privacy Policy explains how the Roamie travel planning
            application ("we," "our," or "the app") handles your information.
            Your privacy is critically important to us.
          </p>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">
              1. Information We Do Not Collect
            </h2>
            <p>
              We are committed to data minimization. Roamie is designed to be
              used without collecting your personal data.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>We do not require an account or registration.</li>
              <li>
                We do not collect your name, email address, or phone number.
              </li>
              <li>We do not track your location.</li>
              <li>
                We do not use cookies or similar tracking technologies for
                analytics or advertising.
              </li>
              <li>
                We do not collect or store your travel plans, budgets, or
                selections on our servers.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">
              2. Information We Handle Locally
            </h2>
            <p>
              To provide the core functionality of the app, the information you
              enter is processed and stored temporarily only on your own device
              (in your web browser's local storage).
            </p>
            <p>This includes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your total budget and currency.</li>
              <li>
                Trip details: number of travelers, nights, origin city, and
                destination.
              </li>
              <li>Your selected flight, hotel, and activity options.</li>
              <li>
                Your trip preferences (e.g., "adventure" or "relaxing").
              </li>
            </ul>
            <p className="font-medium">
              This data never leaves your device and is automatically cleared
              when you close your browser tab or use the "Start Over" function,
              unless your browser is set to persist local data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">
              3. How We Use Your Information
            </h2>
            <p>
              The information you enter is used solely within the app on your
              device to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Calculate your budget allocation and feasibility.</li>
              <li>
                Filter and display travel options that fit your budget.
              </li>
              <li>Generate your travel itinerary.</li>
            </ul>
            <p>
              There is <strong>no backend server</strong> transmitting,
              processing, or storing your personal trip data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">
              4. Data Sharing and Disclosure
            </h2>
            <p>
              We have a simple policy:{" "}
              <strong>
                We do not share, sell, rent, or trade any of your data with
                third parties.
              </strong>{" "}
              Since we don't collect it, we can't disclose it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">
              5. Third-Party Services
            </h2>
            <p>
              Roamie is a self-contained planning tool. We do not integrate with
              third-party booking engines, payment processors, or social media
              platforms within the app.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">
              6. Data Security
            </h2>
            <p>
              As your data remains locally on your device, its security is
              dependent on your own browser and device security settings.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">
              7. Your Rights and Control
            </h2>
            <p>You have full control over your information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Access & Deletion:</strong> You can view or delete all
                your trip data at any time by clearing your browser's local
                storage for this website or by clicking the "Start Over" button
                within the app, which resets all information.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">
              8. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this policy from time to time. We will notify you of
              any changes by posting the new Privacy Policy on this page and
              updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">
              9. Contact Us
            </h2>
            <p>
              If you have any questions about this Policy, please contact us at:
            </p>
            <p>
              <a
                href="mailto:privacy@roamie.app"
                className="text-primary hover:underline font-medium"
              >
                privacy@roamie.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
