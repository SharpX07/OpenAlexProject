
import { Checkbox } from "@/components/ui/checkbox"

interface GroupProps {
    text: string
}

const Group: React.FC<GroupProps> = ({ text }) => {
    return (
        <div className="mb-1">
            <div className="flex items-center space-x-2">
                <Checkbox className="bg-[#f2f0e8] dark:border-[#d5bdaf]" id="terms" />
                <label
                    htmlFor="terms"
                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {text}
                </label>
            </div>
        </div>
    );
}

export default Group;