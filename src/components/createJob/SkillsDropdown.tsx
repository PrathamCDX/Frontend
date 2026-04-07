"use client";

import { useEffect, useState } from "react";
import {
  FieldError,
  FieldValues,
  Merge,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { OptionType } from "./CreateJobForm";
import { useDebounce } from "@/utils/useDebounce";
import useGetSkill from "@/utils/useGetSkill";
import { ChevronDown, X } from "lucide-react";
import { Skills } from "@/types/JobDetailsType";
import { toast } from "sonner";

export default function SkillsDropdown<TFormValues extends FieldValues>({
  fieldName,
  setValue,
  error,
  jwtToken,
  fieldValue,
  handleSkillDelete,
  handleSkillAdd,
  trigger,
}: {
  fieldName: Path<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  error: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  jwtToken: string | null;
  trigger?: UseFormTrigger<TFormValues>;
  fieldValue?: Skills[];
  handleSkillDelete?: (id: number) => void;
  handleSkillAdd?: (id: number, name: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const [skillIdArray, setSkillIdArray] = useState<number[]>(
    fieldValue
      ? fieldValue.map((v) => {
          return v.id;
        })
      : [],
  );
  const [skillNameArray, setSkillNameArray] = useState<
    { id: number; name: string }[]
  >(fieldValue ?? []);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {}, [skillNameArray, skillIdArray]);

  const [skills, setSkills] = useState<OptionType[]>([]);
  const [skillName, setSkillName] = useState<string | null>(null);
  const debouncedSkill = useDebounce(skillName, 400);

  const { data: skillData } = useGetSkill(jwtToken, debouncedSkill);

  useEffect(() => {
    if (skillData) {
      if (!skillName || skillName?.length === 0) {
        setToggle(false);
      } else {
        setToggle(true);
      }
      setSkills(skillData);
    }
  }, [skillData, skillName]);

  // const handleSkillSelect = (skill: { id: number; name: string }) => {
  //   if (skillIdArray.includes(skill.id)) {
  //     toast.error("This skill is already selected!", {
  //       position: "top-left",
  //       autoClose: 3000,
  //       theme: "light",
  //     });
  //     return;
  //   }

  //   setSkillNameArray((prev) => [...prev, skill]);
  //   setSkillIdArray((prev) => {
  //     const updated = [...prev, skill.id];
  //     setValue(fieldName, updated as PathValue<TFormValues, Path<TFormValues>>);
  //     return updated;
  //   });
  //   handleSkillAdd?.(skill.id)
  // };

  const handleSkillSelect = (skill: { id: number; name: string }) => {
    if (skillIdArray.includes(skill.id)) {
      toast.error("This skill is already selected!");
      return;
    }

    setSkillNameArray((prev) => [...prev, skill]);

    const updated = [...skillIdArray, skill.id];
    setSkillIdArray(updated);
    setValue(fieldName, updated as PathValue<TFormValues, Path<TFormValues>>);
    trigger?.(fieldName);
    handleSkillAdd?.(skill.id, skill.name);
  };
  // const handleRemoveSkill = (id: number) => {
  //   setSkillIdArray((prev) => {
  //     const updated = prev.filter((skillId) => skillId !== id);
  //     setValue(fieldName, updated as PathValue<TFormValues, Path<TFormValues>>);
  //     return updated;
  //   });

  //   setSkillNameArray((prev) => prev.filter((skill) => skill.id !== id));
  // };

  const handleRemoveSkill = (id: number) => {
    setSkillIdArray((prev) => prev.filter((skillId) => skillId !== id));
    setSkillNameArray((prev) => prev.filter((skill) => skill.id !== id));
    trigger?.(fieldName);
  };

  useEffect(() => {
    setValue(
      fieldName,
      skillIdArray as PathValue<TFormValues, Path<TFormValues>>,
    );
  }, [skillIdArray, setValue, fieldName]);

  if (!mounted) return null;

  return (
    <div>
      {/* Selected skills */}

      {/* Dropdown */}
      <div>
        <div className="flex items-center justify-start w-full  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          {
            <div className="flex flex-wrap items-center gap-2  w-full">
              {skillNameArray &&
                skillNameArray.length > 0 &&
                skillNameArray.map((skill) => (
                  <div
                    className="flex justify-between items-center m-1 px-2 py-0.5 border rounded-2xl w-fit gap-x-3"
                    key={skill.id}
                  >
                    <div className="text-sm">{skill.name}</div>
                    <div
                      onClick={() => {
                        handleRemoveSkill(skill.id);
                        handleSkillDelete?.(skill.id);
                      }}
                      className="cursor-pointer"
                    >
                      <X size={16} className="hover:text-black" />
                    </div>
                  </div>
                ))}
              <input
                className="min-w-[200px] flex-1 h-full pl-5 pr-3 py-2 placeholder:text-[#7C8599]"
                onChange={(e) => setSkillName(e.target.value)}
                value={skillName ?? ""}
                type="text"
                placeholder="Search a skill"
              />
            </div>
          }

          <ChevronDown className="hover:cursor-pointer hidden" />
        </div>

        {toggle && (
          <div
            className={`max-h-[25vh] overflow-y-auto rounded-md ${
              toggle ? "border border-gray-500" : "border border-transparent"
            }`}
          >
            {skills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => {
                  handleSkillSelect(skill);
                  setToggle(false);
                  setSkillName("");
                }}
                className="px-2 py-1 cursor-pointer hover:bg-gray-100"
              >
                {skill.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 mt-1 ml-1">
          {error.message || "This field is required"}
        </p>
      )}
    </div>
  );
}
