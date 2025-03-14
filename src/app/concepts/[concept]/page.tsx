import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getSortedBlogPostsData } from '@/lib/blogPosts';

interface BookPost {
  title: string;
  slug: string;
  description: string;
  image: string;
  concepts: string[];
}

// Adding interface for blog posts
// interface BlogPost {
//   id: string;
//   title: string;
//   author: string;
//   date: string;
//   description: string;
//   image: string;
//   slug: string;
//   concepts: string[];
// }

type Props = {
  params: Promise<{ concept: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { concept } = await params;
  const decodedConcept = decodeURIComponent(concept);
  return {
    title: `${decodedConcept} | Conceptos | Metaxis Digital`,
    description: `Libros relacionados con el concepto de ${decodedConcept}`,
  };
}

// Generate static params for all concepts
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'public', 'bookposts');

  const conceptSet = new Set<string>();

  async function getAllFiles(dirPath: string) {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const joinedPath = path.join(dirPath, file);
      const stats = await fs.stat(joinedPath);

      if (stats.isDirectory()) {
        await getAllFiles(joinedPath);
      } else if (file.endsWith('.mdx')) {
        const fileContent = await fs.readFile(joinedPath, 'utf-8');
        const { data } = matter(fileContent);

        if (Array.isArray(data.concepts)) {
          data.concepts.forEach(concept => conceptSet.add(concept.toLowerCase()));
        }
      }
    }
  }

  await getAllFiles(postsDirectory);

  return Array.from(conceptSet).map((concept) => ({
    concept: concept,
  }));
}

export default async function ConceptPage({ params }: Props) {
  const postsDirectory = path.join(process.cwd(), 'public', 'bookposts');
  const relatedPosts: BookPost[] = [];
  const { concept } = await params;
  const decodedConcept = decodeURIComponent(concept);
  // Get blog posts related to the concept
  const allBlogPosts = getSortedBlogPostsData();
  const relatedBlogPosts = allBlogPosts.filter(post =>
    Array.isArray(post.concepts) &&
    post.concepts.map(c => c.toLowerCase()).includes(decodedConcept.toLowerCase())
  );

  async function getAllFiles(dirPath: string) {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const joinedPath = path.join(dirPath, file);
      const stats = await fs.stat(joinedPath);

      if (stats.isDirectory()) {
        await getAllFiles(joinedPath);
      } else if (file.endsWith('.mdx')) {
        const fileContent = await fs.readFile(joinedPath, 'utf-8');
        const { data } = matter(fileContent);

        if (Array.isArray(data.concepts) &&
          data.concepts.map(c => c.toLowerCase()).includes(decodedConcept.toLowerCase())) {
          // Extract the image filename without the './' prefix
          const imageFilename = data.image.replace('./', '');

          relatedPosts.push({
            title: data.title,
            slug: data.slug,
            description: data.description,
            image: imageFilename, // Store just the filename
            concepts: data.concepts,
          });
        }
      }
    }
  }

  await getAllFiles(postsDirectory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Contenido relacionado con <b>{decodedConcept}</b>
      </h1>

      {/* Display blog posts section */}
      {relatedBlogPosts.length > 0 && (
        <>
          <h2 className="text-3xl font-bold mt-8 mb-6">Artículos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
            {relatedBlogPosts.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.slug}
                className="group hover:transform hover:scale-105 transition-all duration-200"
              >
                <div className="bg-white/5 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm border border-white/10">
                  <div className="relative h-56 md:h-64">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 md:p-7">
                    <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
                    <p className="text-gray-300 text-xs mb-3">Por {post.author} • {post.date}</p>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Display books section */}
      {relatedPosts.length > 0 && (
        <>
          <h2 className="text-3xl font-bold mt-8 mb-6">Libros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {relatedPosts.map((post) => (
              <Link
                href={`/biblioteca/${post.slug}`}
                key={post.slug}
                className="group hover:transform hover:scale-105 transition-all duration-200"
              >
                <div className="bg-white/5 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm border border-white/10">
                  <div className="relative h-56 md:h-64">
                    <Image
                      src={`/bookposts/${post.image.replace('.jpg', '')}/${post.image}`}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 md:p-7">
                    <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                      {post.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {relatedPosts.length === 0 && relatedBlogPosts.length === 0 && (
        <p className="text-center text-xl mt-12">No hay contenido relacionado con este concepto.</p>
      )}
    </div>
  );
}