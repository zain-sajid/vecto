import TemplateCard from './TemplateCard';

export default function TemplateCards({
  templates,
  selectedTemplates,
  setSelectedTemplates,
}) {
  function toggleTemplate(templateId) {
    setSelectedTemplates((prev) => {
      if (prev.includes(templateId)) {
        return prev.filter((id) => id !== templateId);
      } else {
        return [...prev, templateId];
      }
    });
  }

  return (
    <fieldset className="mt-4 flex flex-col gap-6">
      {templates.map((template) => {
        return (
          <TemplateCard
            key={template.template_id}
            template={template}
            checked={selectedTemplates.includes(template.template_id)}
            toggleTemplate={toggleTemplate}
          />
        );
      })}
    </fieldset>
  );
}
