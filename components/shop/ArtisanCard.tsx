import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { Artisan } from "@/lib/types";

type Props = { artisan: Artisan };

export function ArtisanCard({ artisan }: Props) {
  return (
    <div className="artisan-card">
      <div className="artisan-img-wrap">
        <Image
          src={artisan.photo}
          alt={artisan.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="artisan-card-body">
        <p className="artisan-location">
          <MapPin size={12} />
          {artisan.village}, {artisan.state}
        </p>
        <h3 className="artisan-name">{artisan.name}</h3>
        <p className="artisan-bio">{artisan.shortBio}</p>
        <div className="artisan-stats">
          <div className="artisan-stat">
            <strong>{artisan.yearsOfExperience}+</strong>
            <span>Years</span>
          </div>
          <div className="artisan-stat">
            <strong>{artisan.productsMade}+</strong>
            <span>Products</span>
          </div>
          <div className="artisan-stat">
            <strong>{artisan.familySize}</strong>
            <span>Family</span>
          </div>
        </div>
        <Link href={`/empowerment/${artisan.id}`} className="btn btn-secondary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
          Read Story <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
