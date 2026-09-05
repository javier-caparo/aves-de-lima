/**
 * Represents a bird entity as defined in the static JSON database.
 */
export interface Bird {
  id: string;
  common_name: string;
  scientific_name: string;
  image_url: string;
  habitat: string;
  description: string;
}