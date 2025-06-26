CREATE TABLE "verification_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"hashed_otp" text NOT NULL,
	"valid_till" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verification_request" ADD CONSTRAINT "verification_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;