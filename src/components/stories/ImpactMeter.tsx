/**
 * Impact Meter Component
 * 
 * Displays predicted impact on a sector with severity indicator and description.
 */

interface Impact {
    sector: string;
    sectorName?: string;
    icon?: string;
    color?: string;
    type: 'positive' | 'negative' | 'neutral' | 'uncertain';
    severity: number; // 1-5
    prediction: string;
    confidence: number; // 0-1
}

interface ImpactMeterProps {
    impact: Impact;
}

const defaultIcons: Record<string, string> = {
    economic: '📊',
    geopolitical: '🌐',
    political: '🏛️',
    social: '👥',
    technological: '💻',
    supply_chain: '🚚',
    ecological: '🌍',
};

const typeColors: Record<string, { bg: string; bar: string; text: string }> = {
    positive: { bg: 'bg-green-50', bar: 'bg-green-500', text: 'text-green-700' },
    negative: { bg: 'bg-red-50', bar: 'bg-red-500', text: 'text-red-700' },
    neutral: { bg: 'bg-slate-50', bar: 'bg-slate-400', text: 'text-slate-700' },
    uncertain: { bg: 'bg-amber-50', bar: 'bg-amber-500', text: 'text-amber-700' },
};

export function ImpactMeter({ impact }: ImpactMeterProps) {
    const colors = typeColors[impact.type] || typeColors.neutral;
    const icon = impact.icon || defaultIcons[impact.sector] || '•';
    const sectorName = impact.sectorName || impact.sector.replace(/_/g, ' ');
    const severityPercent = (impact.severity / 5) * 100;
    const confidencePercent = Math.round(impact.confidence * 100);

    return (
        <div className={`rounded-lg p-4 ${colors.bg} mb-4`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className={`text-sm font-bold uppercase ${colors.text}`}>
                        {sectorName}
                    </span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.text} ${colors.bg} border`}>
                    {impact.type}
                </span>
            </div>

            {/* Severity meter */}
            <div className="mb-3">
                <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-1">
                    <span>Severity</span>
                    <span>{impact.severity}/5</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div
                        className={`h-full ${colors.bar} transition-all`}
                        style={{ width: `${severityPercent}%` }}
                    />
                </div>
            </div>

            {/* Prediction */}
            <p className="text-sm text-[var(--foreground)] leading-relaxed">
                {impact.prediction}
            </p>

            {/* Confidence */}
            <div className="mt-2 text-xs text-[var(--muted-foreground)]">
                Confidence: {confidencePercent}%
            </div>
        </div>
    );
}

/**
 * Impact Summary Component
 * 
 * Shows a compact list of all sector impacts for a story.
 */
interface ImpactSummaryProps {
    impacts: Impact[];
}

export function ImpactSummary({ impacts }: ImpactSummaryProps) {
    if (impacts.length === 0) {
        return (
            <div className="text-sm text-[var(--muted-foreground)] italic">
                No impact predictions available
            </div>
        );
    }

    return (
        <div className="space-y-0">
            {impacts.map((impact, idx) => (
                <ImpactMeter key={idx} impact={impact} />
            ))}
        </div>
    );
}
