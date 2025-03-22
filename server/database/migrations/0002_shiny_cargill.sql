ALTER TABLE `pages` ADD `isPublic` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` ADD `isFavorite` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` ADD `path` text NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` ADD `parent_id` integer REFERENCES pages(id);--> statement-breakpoint
ALTER TABLE `pages` ADD `lastUpdatedAt` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` ADD `lastUpdatedByName` text NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` ADD `createdAt` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` ADD `createdByName` text NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` ADD `deletedAt` integer;