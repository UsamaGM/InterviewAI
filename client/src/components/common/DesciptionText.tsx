import { useState } from "react";

type DescriptionTextProps = {
  description: string;
  linesToShow?: number;
  className?: string;
};

function DescriptionText({
  description,
  linesToShow,
  className,
}: DescriptionTextProps) {
  const [readMore, setReadMore] = useState<boolean>(false);

  // Split by double newlines to preserve paragraph structure
  const paragraphs = description.split(/\n\n+/);

  return (
    <div className="flex flex-col space-y-2">
      {paragraphs.map((paragraph, index) => {
        // Split each paragraph by single newlines for line breaks
        const lines = paragraph.split("\n");

        return (
          <div
            key={index}
            className={`${
              !readMore && index > 0 ? "hidden" : ""
            } text-justify ${
              index === 0 && !readMore ? `line-clamp-${linesToShow ?? 3}` : ""
            } ${className}`}
          >
            {lines.map((line, lineIndex) => (
              <p
                key={lineIndex}
                className="text-gray-700 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: line
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
                    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic text
                    .replace(
                      /`(.*?)`/g,
                      '<code class="bg-gray-100 px-1 rounded">$1</code>'
                    ) // Code
                    .replace(/\n/g, "<br />"), // Line breaks
                }}
              />
            ))}
          </div>
        );
      })}
      {description.length > 200 && (
        <button
          className="text-blue-600 hover:text-blue-800 cursor-pointer w-fit text-sm font-medium mt-2 transition-colors duration-200"
          onClick={() => setReadMore(!readMore)}
        >
          {readMore ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

export default DescriptionText;
