import { useEffect } from 'react';

interface DocumentHeadProps {
  title: string;
  description?: string;
}

/**
 * Component to manage document title and meta description for SEO
 */
const DocumentHead: React.FC<DocumentHeadProps> = ({
  title,
  description = 'Search and discover movies from around the world'
}) => {
  useEffect(() => {
    // Set page title
    const siteTitle = 'Movie Explorer';
    document.title = `${title} | ${siteTitle}`;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
    
    return () => {
      // Cleanup function not needed for title
      // but could be used for other dynamic head elements
    };
  }, [title, description]);
  
  // This component doesn't render anything
  return null;
};

export default DocumentHead;
