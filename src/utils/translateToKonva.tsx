import { Line, Path } from 'react-konva';
import { Audience, AudienceIcon, AudienceText } from '../components/konva-components';
import { IAuditorium, IService } from './interfaces';

function getAudiences(audiences: IAuditorium[]): React.ReactNode[] {
    return audiences.map((auditorium) => {
        const children = auditorium.children.map((child, index) => {
            switch (child.type) {
            case 'icon':
                return (
                    <AudienceIcon 
                        key={`${child.identifier}${index}`} 
                        x={child.x} 
                        y={child.y} 
                        imgName={child.identifier} 
                    />
                );
            case 'text':
                return (
                    <AudienceText 
                        key={`${child.identifier}${index}`} 
                        x={child.x} 
                        y={child.y} 
                        text={child.identifier}
                        alignX={child.alignX === '' ? undefined : child.alignX}
                        alignY={child.alignY === '' ? undefined : child.alignY}
                    />
                );
            }
        });
        const doors = auditorium.doors.map((door, index) => {
            return (
                <Line 
                    key={`door-${index}`}
                    points={[door.x + 2.5, door.y + 2.5, door.x + 2.5 + door.width, door.y + 2.5 + door.height]}
                    stroke={door.fill}
                    strokeWidth={5}
                />
            );
        })

        return (
            <Audience 
                key={auditorium.id}
                x={auditorium.x} 
                y={auditorium.y} 
                width={auditorium.width} 
                height={auditorium.height}
                fill={auditorium.fill === null ? undefined : auditorium.fill}
                stroke={auditorium.stroke === null ? undefined : auditorium.stroke}
            >
                {doors}
                {children}
            </Audience>
        )
    })
}

function getService(services: IService[]): React.ReactNode[] {
    return services.map((service, index) => {
        return (
            <Path 
                key={`service-${index}`}
                x={service.x}
                y={service.y}
                data={service.data}
                fill={service.fiil === null ? undefined : service.fiil}
                stroke={service.stroke === null ? undefined : service.stroke}
                strokeWidth={service.stroke ? 5: undefined}
                
            />
        );
    })
}

export {
    getAudiences,
    getService
};

