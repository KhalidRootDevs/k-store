import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomDeleteModalProps } from "@/lib/types";
import { Button } from "../ui/button";

export default function DeleteModal({
  open,
  setOpen,
  title = "Are you sure you want to delete?",
  action,
}: CustomDeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Confirmation!</DialogTitle>
            <DialogDescription>{title}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Not Now</Button>
            </DialogClose>
            <Button type="submit" variant="destructive" onClick={action}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
