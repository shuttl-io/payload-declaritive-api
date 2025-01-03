# Payload-declaritive

This is a library to provide a zod like declaritive API for PayloadCMS.

## Example

```typescript

import { Group, Text, Row, Relationship, DateField, Block, Blocks, type BlockType, Collection } from "payload-declaritive";
import { LinkBlocks, TopNav } from "./navbar";
import { isAfter, isBefore } from "date-fns";

const AnnouncementBlock = Block("announcement", {
    "message": Text().withAdminPlaceHolder("Announcement Message").required(),
    "dateActive": DateField().withLabel("Start Date").required(),
    "dateStop": DateField().withLabel("End Date"),
    links: LinkBlocks
        .withMinRows(1)
        .withMaxRows(1)
        .transform(v => v !== undefined ? v[0] : null),
    
})

export const SiteMetadataCollection = Collection({
    name: "site_metadata",
    labels: {
        plural: "Site Metadata Details",
        singular: "Site Metadata",
    },
    fields: {
        "meta": Group({
            "details": Row({
                "site_title": Text().withAdminPlaceHolder("site name").withLabel("Site Title").required(),
                "gtm_id": Text().withLabel("GTM ID").required(),
            })
        }),
        navigation: Group({
            "top": Relationship(TopNav).required(),
        }),
        siteAnnouncement: Blocks(AnnouncementBlock).withMaxRows(1).transform(x => {
            if (x === undefined) {
                return null;
            }
            if (x.length === 0) {
                return null;
            }
            const announcement = x[0] as BlockType<typeof AnnouncementBlock>
            if (isAfter(Date.now(), announcement.dateActive) && (!announcement.dateStop || isBefore(announcement.dateStop, Date.now()))) {
                return announcement
            }
            return null
        }),
    }
})

const metadata = SiteMetadataCollection.get("1");
metadata.meta.site_title // This will be typed as a string
metadata.siteAnnouncement // this will be typed as `null` | { message: string, dateActive: Date, dateStop: Date | null, links: ...}
```
