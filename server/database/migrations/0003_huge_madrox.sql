PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_blocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pageId` integer NOT NULL,
	`index` real NOT NULL,
	`type` text NOT NULL,
	`textContent` text NOT NULL,
	FOREIGN KEY (`pageId`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_blocks`("id", "pageId", "index", "type", "textContent") SELECT "id", "pageId", "index", "type", "textContent" FROM `blocks`;--> statement-breakpoint
DROP TABLE `blocks`;--> statement-breakpoint
ALTER TABLE `__new_blocks` RENAME TO `blocks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `block_page_id` ON `blocks` (`pageId`);