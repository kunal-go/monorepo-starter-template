CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"email" text NOT NULL,
	"hashed_password" text NOT NULL,
	"password_updated_at" timestamp,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_insider" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
