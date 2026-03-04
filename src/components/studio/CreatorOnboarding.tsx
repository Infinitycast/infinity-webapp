"use client";

import { useState } from "react";

import { StudioLayout } from "@/components/layouts/StudioLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User,
  Mic,
  FileCheck,
  Upload,
  Check,
  ChevronRight,
  ChevronLeft,
  Globe,
  Twitter,
  Instagram,
} from "lucide-react";
import { User as UserType } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, title: "Profile", icon: User },
  { id: 2, title: "Creator Details", icon: Mic },
  { id: 3, title: "Terms & Conditions", icon: FileCheck },
];

const CATEGORIES = [
  "Technology",
  "Gaming",
  "Music",
  "Film & TV",
  "Science",
  "Business",
  "Sports",
  "Comedy",
  "Education",
  "Health & Wellness",
  "True Crime",
  "Politics",
];

interface CreatorOnboardingProps {
  user: UserType;
}

export default function CreatorOnboarding(props: CreatorOnboardingProps) {
  const { user } = props;

  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState<string>("");

  const [profile, setProfile] = useState({
    displayName: `${user?.first_name} ${user?.last_name}` || "",
    bio: "",
    website: "",
    twitter: "",
    instagram: "",
  });

  const [creatorDetails, setCreatorDetails] = useState({
    categories: [] as string[],
    experience: "",
    language: "",
    description: "",
  });

  const [terms, setTerms] = useState({
    termsAccepted: false,
    communityGuidelines: false,
    contentPolicy: false,
    ageConfirmation: false,
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (cat: string) => {
    setCreatorDetails((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : prev.categories.length < 4
        ? [...prev.categories, cat]
        : prev.categories,
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          profile.displayName.trim().length > 0 && profile.bio.trim().length > 0
        );
      case 2:
        return (
          creatorDetails.categories.length > 0 &&
          creatorDetails.experience !== "" &&
          creatorDetails.language !== ""
        );
      case 3:
        return (
          terms.termsAccepted &&
          terms.communityGuidelines &&
          terms.contentPolicy &&
          terms.ageConfirmation
        );
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    //becomeCreator();
    toast.success("Welcome to the creator community! 🎉");
    router.push("/studio");
    setIsSubmitting(false);
  };

  return (
    <StudioLayout user={user}>
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display mb-2">
            Become a Creator
          </h1>
          <p className="text-muted-foreground">
            Set up your creator profile and start sharing content with the
            world.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isComplete = currentStep > step.id;

            return (
              <div
                key={step.id}
                className="flex items-center flex-1 last:flex-initial"
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all",
                      isComplete
                        ? "bg-primary border-primary text-primary-foreground"
                        : isActive
                        ? "border-primary text-primary bg-primary/10"
                        : "border-muted-foreground/30 text-muted-foreground"
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium hidden sm:block",
                      isActive
                        ? "text-primary"
                        : isComplete
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-3 rounded-full transition-all",
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-8">
          {/* Step 1: Profile */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display mb-1">Creator Profile</h2>
                <p className="text-sm text-muted-foreground">
                  This is how listeners will discover and recognise you.
                </p>
              </div>

              {/* Avatar */}
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-border bg-muted flex items-center justify-center">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  placeholder="Your creator name"
                  value={profile.displayName}
                  onChange={(e) =>
                    setProfile({ ...profile, displayName: e.target.value })
                  }
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell your audience who you are and what content you create..."
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {profile.bio.length}/500 characters
                </p>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <Label>Social Links (optional)</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      placeholder="https://yourwebsite.com"
                      value={profile.website}
                      onChange={(e) =>
                        setProfile({ ...profile, website: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Twitter className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      placeholder="@username"
                      value={profile.twitter}
                      onChange={(e) =>
                        setProfile({ ...profile, twitter: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      placeholder="@username"
                      value={profile.instagram}
                      onChange={(e) =>
                        setProfile({ ...profile, instagram: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Creator Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display mb-1">Creator Details</h2>
                <p className="text-sm text-muted-foreground">
                  Help us understand your content so we can recommend you to the
                  right audience.
                </p>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <Label>Content Categories * (pick up to 4)</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const selected = creatorDetails.categories.includes(cat);
                    return (
                      <Badge
                        key={cat}
                        variant={selected ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer px-3 py-1.5 text-sm transition-colors",
                          selected && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => toggleCategory(cat)}
                      >
                        {selected && <Check className="h-3 w-3 mr-1" />}
                        {cat}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label>Experience Level *</Label>
                <Select
                  value={creatorDetails.experience}
                  onValueChange={(v) =>
                    setCreatorDetails({ ...creatorDetails, experience: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">
                      Beginner — I'm just getting started
                    </SelectItem>
                    <SelectItem value="intermediate">
                      Intermediate — I've created some content
                    </SelectItem>
                    <SelectItem value="experienced">
                      Experienced — I've been creating for a while
                    </SelectItem>
                    <SelectItem value="professional">
                      Professional — Content creation is my career
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Primary Language */}
              <div className="space-y-2">
                <Label>Primary Language *</Label>
                <Select
                  value={creatorDetails.language}
                  onValueChange={(v) =>
                    setCreatorDetails({ ...creatorDetails, language: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="portuguese">Portuguese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="korean">Korean</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content Description */}
              <div className="space-y-2">
                <Label htmlFor="contentDesc">
                  Describe your content (optional)
                </Label>
                <Textarea
                  id="contentDesc"
                  placeholder="What kind of shows are you planning to create? What makes your content unique?"
                  value={creatorDetails.description}
                  onChange={(e) =>
                    setCreatorDetails({
                      ...creatorDetails,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 3: Terms & Conditions */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display mb-1">
                  Terms & Conditions
                </h2>
                <p className="text-sm text-muted-foreground">
                  Please review and accept the following to complete your
                  creator setup.
                </p>
              </div>

              <div className="space-y-5">
                {/* Terms of Service */}
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={terms.termsAccepted}
                      onCheckedChange={(v) =>
                        setTerms({ ...terms, termsAccepted: v as boolean })
                      }
                      className="mt-0.5"
                    />
                    <div>
                      <Label
                        htmlFor="terms"
                        className="cursor-pointer text-sm font-semibold"
                      >
                        Creator Terms of Service *
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        I agree to the Creator Terms of Service, including
                        content licensing, revenue sharing policies, and dispute
                        resolution procedures. I understand that Infinity
                        reserves the right to remove content that violates these
                        terms.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Community Guidelines */}
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="community"
                      checked={terms.communityGuidelines}
                      onCheckedChange={(v) =>
                        setTerms({
                          ...terms,
                          communityGuidelines: v as boolean,
                        })
                      }
                      className="mt-0.5"
                    />
                    <div>
                      <Label
                        htmlFor="community"
                        className="cursor-pointer text-sm font-semibold"
                      >
                        Community Guidelines *
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        I agree to follow the community guidelines, including
                        respectful communication, no hate speech, harassment, or
                        harmful content. Violations may result in content
                        removal or account suspension.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Policy */}
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="content"
                      checked={terms.contentPolicy}
                      onCheckedChange={(v) =>
                        setTerms({ ...terms, contentPolicy: v as boolean })
                      }
                      className="mt-0.5"
                    />
                    <div>
                      <Label
                        htmlFor="content"
                        className="cursor-pointer text-sm font-semibold"
                      >
                        Content Policy *
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        I confirm that all content I upload will be original or
                        properly licensed. I understand my responsibilities
                        regarding copyright, intellectual property, and content
                        moderation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Age Confirmation */}
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="age"
                      checked={terms.ageConfirmation}
                      onCheckedChange={(v) =>
                        setTerms({ ...terms, ageConfirmation: v as boolean })
                      }
                      className="mt-0.5"
                    />
                    <div>
                      <Label
                        htmlFor="age"
                        className="cursor-pointer text-sm font-semibold"
                      >
                        Age Confirmation *
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        I confirm that I am at least 18 years of age or have
                        parental consent to create and distribute content on
                        this platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() =>
              currentStep === 1
                ? router.push("/")
                : setCurrentStep((s) => s - 1)
            }
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting ? "Setting up..." : "Complete Setup"}
            </Button>
          )}
        </div>
      </div>
    </StudioLayout>
  );
}
