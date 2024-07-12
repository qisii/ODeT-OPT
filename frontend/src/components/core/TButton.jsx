import { Link } from "react-router-dom";

export default function TButton({
    color ='indigo',
    to = '',
    circle= false,
    href = '',
    link = false,
    target = '_blank',
    onClick = () => {},
    children
}) {

    let classes = [
        "flex",
        "whitespace-nowrap",
        "text-sm",
        "border",
        "border-2",
        "border-transparent",
    ];

    if (link) {
        classes = [
            ...classes,
            "transition-colors",
        ];

        switch (color) {
            case "indigo":
                classes = [
                    ...classes,
                    "text=-indigo-500",
                    "focus:border-indigo-500",
                ];
                break;
            case "red":
                    classes = [...classes, "text-red-500", "focus:border-red-500"];
                break;
            case "blue": // Add blue color class
                    classes = [...classes, "text-blue-500", "focus:border-blue-500"];
                break;
            case "yellow": // Add yellow color class
                classes = [...classes, "text-yellow-500", "focus:border-yellow-500"];
            break;
            }
        } else {
            classes = [
                ...classes,
                "text-white",
                "focus:ring-2",
                "focus:ring-offset-2",
            ];
            switch (color) {
                case "indigo":
                    classes = [
                        ...classes,
                        "bg-indigo-600",
                        "hover:bg-indigo-700",
                        "focus:ring-indigo-500",
                    ];
                    break;
                    case "red":
                        classes = [
                            ...classes,
                            "bg-red-600",
                            "hover:bg-red-700",
                            "focus:ring-red-500",
                        ];
                        break;
                    case "green":
                        classes = [
                            ...classes,
                            "bg-emerald-500",
                            "hover:bg-emerald-600",
                            "focus:ring-emerald-400",
                        ];
                        break;
                    case "yellow":
                        classes = [
                            ...classes,
                            "bg-yellow-500",
                            "hover:bg-yellow-600",
                            "focus:ring-yellow-400",
                        ];
                        break;
        }
    }

    if (circle) {
        classes = [
            ...classes,
            "h-8",
            "w-8",
            "items-center",
            "justify-center",
            "rounded-full",
            "text-sm",
        ];
    } else {
        classes = [
            ...classes,
            "p-0",
            "py-2",
            "px-4",
            "rounded-md"
        ];
    }

    

    return (
        <>
            {href && (<a href={href} className={classes.join(" ")} target={target}>{children}</a>
            )}
            {to && (
            <Link to={to} className={classes.join(" ")}>{children}</Link> 
            )}
            {!to && !href && (
                <button onClick={onClick} className={classes.join(" ")}>{children}</button> 
            )}
        </>
    )
}