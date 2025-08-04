import { Button } from "@/components/ui/elements/buttons/Button";
import { Subtitle } from "@/components/ui/elements/titles";
import * as s from "@/components/ui/layout/Sidebar";
import { NotificationPanel } from "@/components/ui/overlays/notification";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DemoPage } from "@/pages/demo/page";
import { NewTechPage } from "@/pages/new-tech/page";
import { TablePage } from "@/pages/table/page";
import { BoltIcon, HomeIcon, MagnifyingGlassIcon, SquaresPlusIcon, TableCellsIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

const pages = {
  Form: <DemoPage />,
  Table: <TablePage />,
  "New Tech": <NewTechPage />,
};

const defaultPage = "Form";

export function Layout() {
  const [page, setPage] = useLocalStorage("current-page", defaultPage);
  useEffect(() => {
    if (!(page in pages)) {
      setPage(defaultPage);
    }
  }, [page]);

  return (
    <>
      <NotificationPanel>
        <s.SidebarLayout sidebar={<Sidebar {...{ page, setPage }} />}>
          {/* <Header {...{ page, setPage }} /> */}
          <div className="h-full w-full relative overflow-auto p-6">{pages[page]}</div>
        </s.SidebarLayout>
      </NotificationPanel>
    </>
  );
}

function Sidebar({ page, setPage }) {

  return (
    <s.Sidebar>
      <s.SidebarHead>
        <s.SidebarItem>
          <s.SidebarIcon src="https://www.eurokosher.it/website/resources/img/logo.svg" className="!px-2.5" />
          <Subtitle h={4}>EuK Certificates</Subtitle>
        </s.SidebarItem>
      </s.SidebarHead>

      <s.SidebarBody>
        <s.SidebarHeading>menu</s.SidebarHeading>
        <s.SidebarLink>
          <HomeIcon />
          <s.SidebarLabel>Home</s.SidebarLabel>
        </s.SidebarLink>
        <s.SidebarLink isActive={page == "Form"} onClick={() => setPage("Form")}>
          <BoltIcon />
          <s.SidebarLabel>Form</s.SidebarLabel>
        </s.SidebarLink>
        <s.SidebarLink isActive={page == "Table"} onClick={() => setPage("Table")}>
          <TableCellsIcon />
          <s.SidebarLabel>Table</s.SidebarLabel>
        </s.SidebarLink>
        <s.SidebarLink>
          <MagnifyingGlassIcon />
          <s.SidebarLabel>Extremely long text overflowing example</s.SidebarLabel>
        </s.SidebarLink>
        <s.SidebarLink isActive={page == "New Tech"} onClick={() => setPage("New Tech")}>
          <SquaresPlusIcon />
          <s.SidebarLabel>New tech</s.SidebarLabel>
        </s.SidebarLink>

        <s.SidebarHeading>some dropdowns</s.SidebarHeading>
        <s.SidebarDropdown title="Mappe Concettuali">
          Yes! You can purchase a license that you can share with your entire team.
        </s.SidebarDropdown>
        <s.SidebarDropdown title="Altre Mappe">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum accusantium, ea doloribus mollitia porro veniam vel cumque
          deserunt harum laudantium dolore hic voluptas error sed praesentium autem, ratione dicta modi!
        </s.SidebarDropdown>
        <s.SidebarDropdown isActive={page == "Mappe"} title="Mappers">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum a, beatae sit incidunt dolorum sequi optio officia suscipit
          quasi itaque eveniet qui laborum perferendis eum omnis ab corrupti totam enim.
        </s.SidebarDropdown>
      </s.SidebarBody>

      <s.SidebarFoot>
        <s.SidebarItem>
          <UserCircleIcon />
          <s.SidebarLabel>simo.tasca@gmail.com</s.SidebarLabel>
        </s.SidebarItem>
      </s.SidebarFoot>
    </s.Sidebar>
  );
}

const Header = ({ page, setPage }) => {
  const [darkMode, setDarkMode] = useLocalStorage("theme", false);
  useEffect(() => {
    document.documentElement.dataset.dark = String(darkMode);
  }, [darkMode]);
  return (
    <div className="sticky top-0 z-20 bg-zinc-900 mb-6">
      <header className="flex gap-8 py-4 px-6 items-center border-b border-zinc-300 dark:border-zinc-600">
        <div className="flex items-center gap-3">
          {Object.keys(pages).map((p) => (
            <Button key={p} {...(page === p ? { color: "light" } : { plain: true })} onClick={() => setPage(p)}>
              {p}
            </Button>
          ))}
        </div>
        <Button outline className="ml-auto" onClick={() => setDarkMode((p) => !p)}>
          theme toggle
        </Button>
      </header>
    </div>
  );
};
