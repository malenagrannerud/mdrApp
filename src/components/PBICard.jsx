/**
 * Power BI-inspired card component.
 * Flat design, no rounded corners, no border, subtle shadow.
 * Title and subtitle stacked tightly.
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content inside the card
 * @param {string} [props.title] - Card title in header bar
 * @param {string} [props.subtitle] - Subtitle directly below title
 * @param {string} [props.className] - Additional CSS classes
 */
export default function PBICard({ children, title, subtitle, className = '' }) {
  return (
    <div 
      className={`bg-white ${className}`}
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {title && (
        <div 
          style={{
            padding: '10px 16px 8px 16px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#ffffff'
          }}
        >
          <h4 style={{ margin: 0 }}>{title}</h4>
          {subtitle && (
            <p style={{ margin: '2px 0 0 0' }}>{subtitle}</p>
          )}
        </div>
      )}
      <div style={{ padding: '16px', flex: 1 }}>
        {children}
      </div>
    </div>
  )
}