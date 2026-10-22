/** A single original SVG, clipped and shaded by the drawer progress. */
export function BuildingIllustration({ kind }: { kind: 'guk' | 'irit-rtf' }) {
    const isIrit = kind === 'irit-rtf';
    return <div className={`building-illustration building-illustration-${kind}`} aria-hidden="true">
        <div className="building-illustration-art">
            <img src={`/remake/${kind}.svg`} width={isIrit ? 162.061 : 360.938}
                height={isIrit ? 56.4403 : 100} alt="" />
        </div>
        <div className="building-illustration-fade" />
    </div>;
}
